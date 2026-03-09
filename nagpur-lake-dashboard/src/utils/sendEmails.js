import emailjs from "@emailjs/browser"

// 🔴 EmailJS config (replace with YOUR values)
const SERVICE_ID = "service_reef"
const TEMPLATE_ID = "template_paf016l"
const PUBLIC_KEY = "VXcM70cnhpF-xQWZ1"

// Alert recipients (comma separated)
const ALERT_EMAILS = "ashishkamble0422@gmail.com,aryannandanwar738@gmail.com"

export async function sendCriticalLakeEmail(lakeName, avgPlant) {
  try {
    console.log(lakeName)
    console.log(avgPlant)
    const result = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        lake_name: lakeName,
        avg_plant: avgPlant.toFixed(2),
        to_email: ALERT_EMAILS
      },
      PUBLIC_KEY
    )

    console.log("✅ Email sent:", result.text)
  } catch (error) {
    console.error("❌ EmailJS error:", error)
  }
}
