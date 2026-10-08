document.addEventListener("DOMContentLoaded", () => {
    // 1. قراءة البيانات المسجلة من localStorage (سواء فردية أو كائن)
    const name = localStorage.getItem("studentName") || "—";
    const email = localStorage.getItem("studentEmail") || "—";
    const year = localStorage.getItem("studentYear") || "—";
    const major = localStorage.getItem("studentMajor") || localStorage.getItem("studentSubject") || "—";
    const track = localStorage.getItem("studentTrack") || "—";

    // 2. تعبئة البيانات في العناصر المناسبة بالـ IDs الموجودة في الصفحة
    const nameElem = document.getElementById("name");
    const headerNameElem = document.getElementById("studentName");
    const emailElem = document.getElementById("email");
    const yearElem = document.getElementById("year");
    const subjectElem = document.getElementById("subject");
    const trackElem = document.getElementById("track");

    if (nameElem) nameElem.textContent = name;
    if (headerNameElem) headerNameElem.textContent = name !== "—" ? name : "Student Profile";
    if (emailElem) emailElem.textContent = email;
    if (yearElem) yearElem.textContent = year;
    if (subjectElem) subjectElem.textContent = major;
    if (trackElem) trackElem.textContent = track;
});