// Supabase Edge Function (Deno)
// 근무표 사진을 Gemini Vision에 보내 Dia 후보 행(JSON)으로 구조화 추출한다.
// 이 함수는 추출만 수행하고 DB에는 아무것도 쓰지 않는다 — 결과 저장(pending
// 배치 INSERT)은 프론트엔드에서 Supabase 클라이언트로 별도 처리한다.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ExtractedDiaRow {
  dia_id: string;
  type_name: string;
  work_time: string;
  first_time: string;
  second_time: string;
  third_time: string;
  total_time: string;
  num_tr1: string;
  num_tr2: string;
  _confidence?: "high" | "low";
}

interface RequestImage {
  data: string; // base64, no data URL prefix
  mime_type: string;
}

const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    rows: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          dia_id: { type: "STRING" },
          type_name: { type: "STRING" },
          work_time: { type: "STRING" },
          first_time: { type: "STRING" },
          second_time: { type: "STRING" },
          third_time: { type: "STRING" },
          total_time: { type: "STRING" },
          num_tr1: { type: "STRING" },
          num_tr2: { type: "STRING" },
          _confidence: { type: "STRING", enum: ["high", "low"] },
        },
        required: [
          "dia_id",
          "type_name",
          "work_time",
          "first_time",
          "second_time",
          "third_time",
          "total_time",
          "num_tr1",
          "num_tr2",
        ],
      },
    },
    warning: { type: "STRING", nullable: true },
  },
  required: ["rows"],
};

const SYSTEM_PROMPT = `당신은 철도/버스 승무소의 "근무표(다이아표)" 이미지를 분석해 구조화된 JSON으로 변환하는 전문가입니다.

## 입력
승무소 근무표 이미지 1장 이상. 표 형식, 컬럼명, 언어(한글)는 승무소마다 다를 수 있습니다.
표에는 보통 다음과 같은 개념이 (다른 이름으로), 서로 별개의 컬럼(열)으로 포함됩니다:
- 다이아 번호/근무 코드 (예: "대1", "1번", "A조" 등) → dia_id
- 근무 유형 (예: "평일", "토요일", "휴일", "월-금" 등) → type_name
- 출근시간 → work_time
- 전반 사업(운행) 시간대 → first_time
- 전반 열차/버스 번호(열번) → num_tr1
- 후반 사업 시간대 → second_time
- 후반 열차/버스 번호(열번) → num_tr2
- 세 번째 사업 구간이 있다면 → third_time (없으면 빈 문자열)
- 총 근무시간 → total_time

## 컬럼 매핑 시 매우 중요한 주의사항
- **시간(first_time/second_time/third_time/work_time/total_time)과 열차 열번(num_tr1/num_tr2)은 표에서 항상 서로 다른 열(컬럼)에 있습니다.** 같은 셀 안에 있는 문자열을 구분자나 특수문자 기준으로 잘라서 시간/열번으로 나누지 마세요.
- 시간 값은 그 시간 컬럼에 실제로 적힌 내용 그대로만 담으세요. 시간 문자열 뒤에 붙어 있는 것처럼 보이는 숫자나 기호를 열번으로 옮기지 마세요.
- 열번(num_tr1/num_tr2) 값은 반드시 표의 "열번"에 해당하는 별도 컬럼에서만 읽으세요. 그 컬럼이 표에 없다면 시간 값을 분해해서 만들어내지 말고 빈 문자열 ""로 두세요.
- 각 컬럼의 헤더(제목 행)를 먼저 파악해 어떤 열이 시간이고 어떤 열이 열번인지 확정한 뒤, 그 열 위치를 기준으로만 값을 읽으세요.

## 규칙
1. 표의 각 "행"(근무 1건)을 하나의 JSON 객체로 만드세요.
2. 컬럼명이 정확히 일치하지 않아도 의미상 가장 가까운 필드에 매핑하되, 반드시 원래 컬럼(열) 단위로만 값을 가져오세요.
3. 시간은 "HH:MM" 형식으로 정규화하세요 (예: "5:00" → "05:00", "1730" → "17:30"). 이때도 원래 그 시간 컬럼에 있던 값만 정규화할 뿐, 다른 컬럼의 값을 섞지 마세요.
4. 읽을 수 없거나 표에 없는 값은 빈 문자열 ""로 두세요. 절대 추측해서 지어내지 마세요.
5. 병합된 셀(여러 행에 걸친 값)은 각 행에 동일하게 복사하세요.
6. 표가 여러 장의 이미지에 걸쳐 있다면 모두 종합해 하나의 배열로 합치세요.
7. 다이아표가 아닌 이미지이거나 표를 전혀 인식할 수 없다면 rows를 빈 배열로 반환하고 warning에 사유를 적으세요.
8. 각 행마다, 값을 읽는 데 확신이 낮으면 _confidence를 "low"로 표시하세요. 특히 시간과 열번 컬럼을 혼동했을 가능성이 있으면 반드시 "low"로 표시하세요. 확신이 높으면 "high"로 표시하세요.

JSON 스키마를 반드시 준수해 응답하세요.`;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  let body: { office_name?: string; images?: RequestImage[] };
  try {
    body = await req.json();
  } catch {
    return json({ success: false, error: "잘못된 요청입니다." }, 400);
  }

  const { office_name, images } = body;
  if (!office_name || !Array.isArray(images) || images.length === 0) {
    return json(
      { success: false, error: "승무소명과 이미지가 필요합니다." },
      400
    );
  }
  if (images.length > 5) {
    return json(
      { success: false, error: "이미지는 최대 5장까지 가능합니다." },
      400
    );
  }

  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) {
    return json(
      { success: false, error: "서버 설정 오류: AI API 키가 없습니다." },
      500
    );
  }

  try {
    const parts = [
      { text: SYSTEM_PROMPT },
      ...images.map((img) => ({
        inlineData: { mimeType: img.mime_type, data: img.data },
      })),
    ];

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts }],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: RESPONSE_SCHEMA,
          },
        }),
      }
    );

    if (!geminiRes.ok) {
      console.error("Gemini API error", geminiRes.status, await geminiRes.text());
      return json(
        { success: false, error: "AI 서버 호출에 실패했습니다. 잠시 후 다시 시도해주세요." },
        502
      );
    }

    const geminiData = await geminiRes.json();
    const text: string | undefined =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return json(
        { success: false, error: "인식 결과를 받지 못했습니다." },
        502
      );
    }

    let parsed: { rows: ExtractedDiaRow[]; warning?: string };
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      console.error("JSON parse failed", e, text);
      return json(
        { success: false, error: "인식 결과를 해석하지 못했습니다." },
        502
      );
    }

    return json({
      success: true,
      rows: parsed.rows ?? [],
      warning: parsed.warning ?? undefined,
    });
  } catch (e) {
    console.error(e);
    return json(
      { success: false, error: "AI 추출 중 오류가 발생했습니다." },
      500
    );
  }
});
