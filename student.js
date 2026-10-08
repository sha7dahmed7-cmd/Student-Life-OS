// =====================================================
// STUDENT LIFE OS
// =====================================================


// =====================================================
// DATA
// =====================================================

let tasks =
    JSON.parse(
        localStorage.getItem("studentTasks")
    ) || [];

let subjects =
    JSON.parse(
        localStorage.getItem("studentSubjects")
    ) || [];

let exams =
    JSON.parse(
        localStorage.getItem("studentExams")
    ) || [];

let notes =
    JSON.parse(
        localStorage.getItem("studentNotes")
    ) || [];


// =====================================================
// ELEMENTS
// =====================================================

const loginPage =
    document.getElementById("loginPage");

const app =
    document.getElementById("app");

const loginForm =
    document.getElementById("loginForm");

const studentName =
    document.getElementById("studentName");

const studentEmail =
    document.getElementById("studentEmail");

const studentPassword =
    document.getElementById("studentPassword");

const welcomeName =
    document.getElementById("welcomeName");

const profileName =
    document.getElementById("profileName");

const logoutBtn =
    document.getElementById("logoutBtn");

const darkModeBtn =
    document.getElementById("darkModeBtn");

const notificationBtn =
    document.getElementById("notificationBtn");

const notificationPanel =
    document.getElementById("notificationPanel");

const closeNotifications =
    document.getElementById("closeNotifications");


// =====================================================
// LOGIN MESSAGE
// =====================================================

let loginMessage =
    document.getElementById("loginMessage");

if (!loginMessage && loginForm) {

    loginMessage =
        document.createElement("div");

    loginMessage.id =
        "loginMessage";

    loginMessage.style.marginTop =
        "10px";

    loginMessage.style.textAlign =
        "center";

    loginMessage.style.fontSize =
        "14px";

    loginForm.appendChild(
        loginMessage
    );
}


// =====================================================
// STUDENT DATA
// =====================================================

function saveStudentData(user) {

    if (!user) return;

    // Save user ID
    if (user.id) {
        localStorage.setItem(
            "studentId",
            user.id
        );
    }

    if (user.name) {

        localStorage.setItem(
            "studentName",
            user.name
        );
    }

    if (user.email) {

        localStorage.setItem(
            "studentEmail",
            user.email
        );
    }

    /*
     * مهم:
     * الـTrack الحقيقي موجود في major
     * وليس college.
     */

    if (user.major) {

        localStorage.setItem(
            "studentTrack",
            user.major
        );
    }

    if (user.college) {

        localStorage.setItem(
            "studentCollege",
            user.college
        );
    }

    if (user.study_year) {

        localStorage.setItem(
            "studentYear",
            user.study_year
        );
    }

    if (user.gpa) {

        localStorage.setItem(
            "studentGPA",
            user.gpa
        );
    }

}

function getStudentData() {

    return {

        name:
            localStorage.getItem(
                "studentName"
            ) || "",

        email:
            localStorage.getItem(
                "studentEmail"
            ) || "",

        track:
            localStorage.getItem(
                "studentTrack"
            ) || "",

        college:
            localStorage.getItem(
                "studentCollege"
            ) || "",

        year:
            localStorage.getItem(
                "studentYear"
            ) || "",

        gpa:
            localStorage.getItem(
                "studentGPA"
            ) || ""

    };

}


// =====================================================
// CHECK LOGIN
// =====================================================

function checkLogin() {

    const student =
        getStudentData();

    if (
        student.name &&
        student.email
    ) {

        if (loginPage) {

            loginPage.style.display =
                "none";
        }

        if (app) {

            app.classList.add("show");
        }

        updateStudentInterface();

        loadRecommendedCourses();

    } else {

        if (loginPage) {

            loginPage.style.display =
                "flex";
        }

        if (app) {

            app.classList.remove("show");
        }

    }

}


// =====================================================
// UPDATE STUDENT INTERFACE
// =====================================================

function updateStudentInterface() {

    const student =
        getStudentData();

    if (welcomeName) {

        welcomeName.textContent =
            student.name;
    }

    if (profileName) {

        profileName.textContent =
            student.name;
    }

    const accountName =
        document.getElementById(
            "accountName"
        );

    if (accountName) {

        accountName.textContent =
            student.name ||
            "الطالبة";
    }

    const accountEmail =
        document.getElementById(
            "accountEmail"
        );

    if (accountEmail) {

        accountEmail.textContent =
            student.email || "-";
    }

    const accountTrack =
        document.getElementById(
            "accountTrack"
        );

    if (accountTrack) {

        accountTrack.textContent =
            student.track || "-";
    }

    const accountYear =
        document.getElementById(
            "accountYear"
        );

    if (accountYear) {

        accountYear.textContent =
            student.year || "-";
    }

    const accountGPA =
        document.getElementById(
            "accountGPA"
        );

    if (accountGPA) {

        accountGPA.textContent =
            student.gpa || "-";
    }

}


// =====================================================
// LOGIN
// =====================================================

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();

            const email =
                studentEmail
                    ? studentEmail.value.trim()
                    : "";

            const password =
                studentPassword
                    ? studentPassword.value
                    : "";

            if (loginMessage) {

                loginMessage.textContent =
                    "";
            }

            if (!email || !password) {

                if (loginMessage) {

                    loginMessage.textContent =
                        "من فضلك اكملي البيانات.";
                }

                return;
            }

            try {

                const response =
                    await fetch(
                        "http://localhost:3000/login",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    email:
                                        email,
                                    password:
                                        password
                                })
                        }
                    );

                const data =
                    await response.json();

                if (response.ok) {

                    const user =
                        data.user || {};

                    saveStudentData(user);

                    updateStudentInterface();

                    if (loginPage) {

                        loginPage.style.display =
                            "none";
                    }

                    if (app) {

                        app.classList.add(
                            "show"
                        );
                    }

                    if (studentPassword) {

                        studentPassword.value =
                            "";
                    }

                    if (loginMessage) {

                        loginMessage.textContent =
                            "";
                    }

                    showNotification(
                        "أهلاً بيكي يا " +
                        (user.name || "") +
                        " 👋"
                    );

                    /*
                     * تحميل الكورسات حسب التراك
                     */
                    loadRecommendedCourses();

                } else {

                    if (loginMessage) {

                        loginMessage.textContent =
                            data.error ||
                            "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
                    }

                }

            } catch (error) {

                console.error(
                    "Login Error:",
                    error
                );

                if (loginMessage) {

                    loginMessage.textContent =
                        "مش قادرين نتصل بالسيرفر. اتأكدي إن Node.js شغال.";
                }

            }

        }
    );

}


// =====================================================
// LOGOUT
// =====================================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "studentName"
            );

            localStorage.removeItem(
                "studentEmail"
            );

            localStorage.removeItem(
                "studentTrack"
            );

            localStorage.removeItem(
                "studentCollege"
            );

            localStorage.removeItem(
                "studentYear"
            );

            localStorage.removeItem(
                "studentGPA"
            );
            localStorage.removeItem("studentId");

            if (app) {

                app.classList.remove(
                    "show"
                );
            }

            if (loginPage) {

                loginPage.style.display =
                    "flex";
            }

            if (studentName) {

                studentName.value =
                    "";
            }

            if (studentEmail) {

                studentEmail.value =
                    "";
            }

            if (studentPassword) {

                studentPassword.value =
                    "";
            }

            if (loginMessage) {

                loginMessage.textContent =
                    "";
            }

        }
    );

}


// =====================================================
// NAVIGATION
// =====================================================

const navButtons =
    document.querySelectorAll(
        ".nav-btn"
    );

const sections =
    document.querySelectorAll(
        ".page-section"
    );

navButtons.forEach(button => {

    button.addEventListener(
        "click",
        function () {

            const sectionId =
                this.dataset.section;

            navButtons.forEach(
                btn =>
                    btn.classList.remove(
                        "active"
                    )
            );

            this.classList.add(
                "active"
            );

            sections.forEach(
                section =>
                    section.classList.remove(
                        "active"
                    )
            );

            const targetSection =
                document.getElementById(
                    sectionId
                );

            if (targetSection) {

                targetSection.classList.add(
                    "active"
                );
            }

        }
    );

});


// =====================================================
// DARK MODE
// =====================================================

const savedTheme =
    localStorage.getItem(
        "studentTheme"
    );

if (savedTheme === "dark") {

    document.body.classList.add(
        "dark"
    );

    if (darkModeBtn) {

        darkModeBtn.innerHTML =
            '<i class="fa-solid fa-sun"></i> الوضع النهاري';
    }

}

if (darkModeBtn) {

    darkModeBtn.addEventListener(
        "click",
        function () {

            document.body.classList.toggle(
                "dark"
            );

            const isDark =
                document.body.classList.contains(
                    "dark"
                );

            if (isDark) {

                localStorage.setItem(
                    "studentTheme",
                    "dark"
                );

                darkModeBtn.innerHTML =
                    '<i class="fa-solid fa-sun"></i> الوضع النهاري';

            } else {

                localStorage.setItem(
                    "studentTheme",
                    "light"
                );

                darkModeBtn.innerHTML =
                    '<i class="fa-solid fa-moon"></i> الوضع الليلي';

            }

        }
    );

}


// =====================================================
// MODAL
// =====================================================

let modal =
    document.getElementById(
        "modal"
    );

let modalBody =
    document.getElementById(
        "modalBody"
    );

let closeModal =
    document.getElementById(
        "closeModal"
    );


if (!modal) {

    modal =
        document.createElement(
            "div"
        );

    modal.id =
        "modal";

    modal.innerHTML = `
        <div class="modal-content">

            <button id="closeModal">
                ×
            </button>

            <div id="modalBody"></div>

        </div>
    `;

    document.body.appendChild(
        modal
    );

    modalBody =
        document.getElementById(
            "modalBody"
        );

    closeModal =
        document.getElementById(
            "closeModal"
        );

    modal.style.display =
        "none";
}


function openModal(content) {

    if (!modal || !modalBody)
        return;

    modalBody.innerHTML =
        content;

    modal.style.display =
        "flex";
}


function closeModalFunction() {

    if (!modal || !modalBody)
        return;

    modal.style.display =
        "none";

    modalBody.innerHTML =
        "";
}


if (closeModal) {

    closeModal.addEventListener(
        "click",
        closeModalFunction
    );
}

if (modal) {

    modal.addEventListener(
        "click",
        function (e) {

            if (e.target === modal) {

                closeModalFunction();
            }

        }
    );

}


// =====================================================
// TASKS
// =====================================================

const addTaskBtn =
    document.getElementById(
        "addTaskBtn"
    );

const addTaskFromDashboard =
    document.getElementById(
        "addTaskFromDashboard"
    );

const tasksContainer =
    document.getElementById(
        "tasksContainer"
    );

const dashboardTasks =
    document.getElementById(
        "dashboardTasks"
    );


function openTaskModal() {

    openModal(`

        <h2>إضافة مهمة جديدة</h2>

        <form class="modal-form"
              id="taskForm">

            <input
                type="text"
                id="taskTitle"
                placeholder="اسم المهمة"
                required>

            <input
                type="date"
                id="taskDate"
                required>

            <select id="taskPriority">

                <option value="عادية">
                    أولوية عادية
                </option>

                <option value="مهمة">
                    مهمة
                </option>

                <option value="عاجلة">
                    عاجلة
                </option>

            </select>

            <button
                type="submit"
                class="main-btn">

                إضافة المهمة

            </button>

        </form>
    `);

    const taskForm =
        document.getElementById(
            "taskForm"
        );

    if (!taskForm) return;

    taskForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();

            const title =
                document.getElementById(
                    "taskTitle"
                ).value.trim();

            const date =
                document.getElementById(
                    "taskDate"
                ).value;

            const priority =
                document.getElementById(
                    "taskPriority"
                ).value;

            const user_email =
                localStorage.getItem(
                    "studentEmail"
                );

            try {

                const response =
                    await fetch(
                        "http://localhost:3000/tasks",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    title,
                                    date,
                                    priority,
                                    user_email
                                })
                        }
                    );

                if (response.ok) {

                    const savedTask =
                        await response.json();

                    tasks.push(
                        savedTask
                    );

                    saveTasks();
                    renderTasks();

                    closeModalFunction();

                    showNotification(
                        "تمت إضافة المهمة إلى SQL بنجاح ✅"
                    );

                } else {

                    alert(
                        "حدث خطأ أثناء حفظ المهمة في الداتابيز"
                    );

                }

            } catch (error) {

                console.error(
                    "Task Error:",
                    error
                );

                alert(
                    "مش قادرين نتصل بالسيرفر لحفظ المهمة!"
                );

            }

        }
    );

}


if (addTaskBtn) {

    addTaskBtn.addEventListener(
        "click",
        openTaskModal
    );
}

if (addTaskFromDashboard) {

    addTaskFromDashboard.addEventListener(
        "click",
        openTaskModal
    );
}


function saveTasks() {

    localStorage.setItem(
        "studentTasks",
        JSON.stringify(tasks)
    );
}


function renderTasks() {

    if (!tasksContainer ||
        !dashboardTasks)
        return;

    if (tasks.length === 0) {

        tasksContainer.innerHTML = `

            <div class="empty-state">

                <i class="fa-solid fa-list-check"></i>

                <h3>
                    مفيش مهام لسه
                </h3>

                <p>
                    أضيفي أول مهمة وابدئي يومك.
                </p>

            </div>
        `;

        dashboardTasks.innerHTML = `

            <div class="empty-state">

                <i class="fa-solid fa-list-check"></i>

                <p>
                    مفيش مهام لسه
                </p>

            </div>
        `;

        updateStats();

        return;
    }

    tasksContainer.innerHTML =
        "";

    dashboardTasks.innerHTML =
        "";

    tasks.forEach(task => {

        const element =
            document.createElement(
                "div"
            );

        element.className =
            "task-item " +
            (
                task.completed
                    ? "completed"
                    : ""
            );

        element.innerHTML = `

            <div
                class="task-check"
                onclick="toggleTask(${task.id})">

                ${
                    task.completed
                        ? "✓"
                        : ""
                }

            </div>

            <div class="task-info">

                <div class="task-title">

                    ${escapeHTML(
                        task.title
                    )}

                </div>

                <div class="task-date">

                    ${
                        task.task_date ||
                        task.date ||
                        "بدون تاريخ"
                    }

                    •

                    ${escapeHTML(
                        task.priority
                    )}

                </div>

            </div>

            <button
                class="delete-btn"
                onclick="deleteTask(${task.id})">

                <i class="fa-solid fa-trash"></i>

            </button>
        `;

        tasksContainer.appendChild(
            element
        );

    });


    tasks.slice(0, 4).forEach(
        task => {

            const element =
                document.createElement(
                    "div"
                );

            element.className =
                "task-item " +
                (
                    task.completed
                        ? "completed"
                        : ""
                );

            element.innerHTML = `

                <div
                    class="task-check"
                    onclick="toggleTask(${task.id})">

                    ${
                        task.completed
                            ? "✓"
                            : ""
                    }

                </div>

                <div class="task-info">

                    <div class="task-title">

                        ${escapeHTML(
                            task.title
                        )}

                    </div>

                    <div class="task-date">

                        ${
                            task.task_date ||
                            task.date ||
                            "بدون تاريخ"
                        }

                    </div>

                </div>
            `;

            dashboardTasks.appendChild(
                element
            );

        }
    );

    updateStats();

}
async function sendStudentEmail(subject, message) {

    const userId =
        localStorage.getItem("studentId");

    if (!userId) {
        console.log("No student ID found.");
        return;
    }

    try {

        const response =
            await fetch(
                "http://localhost:3000/send-email",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        user_id: userId,
                        subject: subject,
                        message: message
                    })
                }
            );

        const data =
            await response.json();

        if (response.ok) {

            console.log(
                "Email sent successfully:",
                data.email
            );

        } else {

            console.error(
                "Email error:",
                data.error
            );

        }

    } catch (error) {

        console.error(
            "Email connection error:",
            error
        );

    }
}


function toggleTask(id) {

    const task =
        tasks.find(
            item =>
                item.id === id
        );

    if (!task) return;

    task.completed =
        !task.completed;

    saveTasks();
    renderTasks();

    showNotification(
        task.completed
            ? "تم إنجاز المهمة 🎉"
            : "تم إرجاع المهمة"
    );

}


function deleteTask(id) {

    tasks =
        tasks.filter(
            task =>
                task.id !== id
        );

    saveTasks();
    renderTasks();

    showNotification(
        "تم حذف المهمة 🗑️"
    );

}


// =====================================================
// SUBJECTS
// =====================================================

const addSubjectBtn =
    document.getElementById(
        "addSubjectBtn"
    );

const subjectsContainer =
    document.getElementById(
        "subjectsContainer"
    );


if (addSubjectBtn) {

    addSubjectBtn.addEventListener(
        "click",
        openSubjectModal
    );

}


function openSubjectModal() {

    openModal(`

        <h2>إضافة مادة</h2>

        <form
            class="modal-form"
            id="subjectForm">

            <input
                type="text"
                id="subjectName"
                placeholder="اسم المادة"
                required>

            <input
                type="text"
                id="subjectTeacher"
                placeholder="اسم الدكتور / المدرس">

            <input
                type="number"
                id="subjectHours"
                placeholder="عدد الساعات"
                min="1">

            <button
                type="submit"
                class="main-btn">

                إضافة المادة

            </button>

        </form>
    `);

    const subjectForm =
        document.getElementById(
            "subjectForm"
        );

    if (!subjectForm) return;

    subjectForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();

            const name =
                document.getElementById(
                    "subjectName"
                ).value.trim();

            const teacher =
                document.getElementById(
                    "subjectTeacher"
                ).value.trim();

            const hours =
                document.getElementById(
                    "subjectHours"
                ).value;

            const user_email =
                localStorage.getItem(
                    "studentEmail"
                );

            try {

                const response =
                    await fetch(
                        "http://localhost:3000/subjects",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    name,
                                    teacher,
                                    hours,
                                    user_email
                                })
                        }
                    );

                if (response.ok) {

                    const savedSubject =
                        await response.json();

                    subjects.push(
                        savedSubject
                    );

                    saveSubjects();
                    renderSubjects();

                    closeModalFunction();

                    showNotification(
                        "تمت إضافة المادة إلى SQL بنجاح 📚"
                    );

                    /*
                     * بعد إضافة المادة:
                     * نبحث عن كورسات مناسبة للمادة.
                     */

                    loadRecommendedCourses(
                        name
                    );

                } else {

                    alert(
                        "حدث خطأ أثناء حفظ المادة"
                    );

                }

            } catch (error) {

                console.error(
                    "Subject Error:",
                    error
                );

                alert(
                    "مش قادرين نتصل بالسيرفر لحفظ المادة!"
                );

            }

        }
    );

}


function saveSubjects() {

    localStorage.setItem(
        "studentSubjects",
        JSON.stringify(subjects)
    );

}


function renderSubjects() {

    if (!subjectsContainer)
        return;

    if (subjects.length === 0) {

        subjectsContainer.innerHTML = `

            <div class="empty-state">

                <i class="fa-solid fa-book"></i>

                <h3>
                    مفيش مواد مضافة
                </h3>

                <p>
                    أضيفي موادك الدراسية.
                </p>

            </div>
        `;

        updateStats();

        return;
    }

    subjectsContainer.innerHTML =
        "";

    subjects.forEach(subject => {

        const card =
            document.createElement(
                "div"
            );

        card.className =
            "subject-card";

        card.innerHTML = `

            <button
                class="card-delete"
                onclick="deleteSubject(${subject.id})">

                <i class="fa-solid fa-trash"></i>

            </button>

            <div class="subject-icon">

                <i class="fa-solid fa-book"></i>

            </div>

            <h3>

                ${escapeHTML(
                    subject.name
                )}

            </h3>

            <p>

                ${
                    escapeHTML(
                        subject.teacher ||
                        "لم يتم تحديد الدكتور"
                    )
                }

            </p>

            <p>
                Credit Hours:
                ${subject.hours || "-"}
            </p>

        `;

        subjectsContainer.appendChild(
            card
        );

    });

    updateStats();

}


function deleteSubject(id) {

    subjects =
        subjects.filter(
            subject =>
                subject.id !== id
        );

    saveSubjects();
    renderSubjects();

    showNotification(
        "تم حذف المادة 🗑️"
    );

}


// =====================================================
// RECOMMENDED COURSES
// =====================================================

const coursesContainer =
    document.getElementById(
        "coursesContainer"
    );


/*
 * تحميل الكورسات حسب التراك أو المادة
 */

async function loadRecommendedCourses(
    subject = ""
) {

    if (!coursesContainer)
        return;

    const student =
        getStudentData();

    const track =
        student.track || "";

    if (!track && !subject) {

        renderNoCourses(
            "اختاري التراك أو أضيفي مادة علشان نقدر نقترحلك كورسات."
        );

        return;
    }

    coursesContainer.innerHTML = `

        <div class="empty-state">

            <i class="fa-solid fa-spinner fa-spin"></i>

            <p>
                بنبحث عن الكورسات المناسبة ليكي...
            </p>

        </div>
    `;

    try {

        const params =
            new URLSearchParams();

        if (track) {

            params.append(
                "track",
                track
            );
        }

        if (subject) {

            params.append(
                "subject",
                subject
            );
        }

        const response =
            await fetch(
                "http://localhost:3000/recommended-courses?" +
                params.toString()
            );

        if (!response.ok) {

            throw new Error(
                "Course API Error"
            );
        }

        const data =
            await response.json();

        if (
            !data.courses ||
            data.courses.length === 0
        ) {

            renderNoCourses(
                subject
                    ? "مفيش كورسات مرتبطة بالمادة دي حاليًا."
                    : "مفيش كورسات مرتبطة بالتراك حاليًا."
            );

            return;
        }

        renderRecommendedCourses(
            data.courses,
            subject
        );

    } catch (error) {

        console.error(
            "Courses Error:",
            error
        );

        renderNoCourses(
            "حصلت مشكلة في تحميل الكورسات. اتأكدي إن السيرفر شغال."
        );

    }

}


/*
 * عرض الكورسات
 */

function renderRecommendedCourses(
    courses,
    subject = ""
) {

    if (!coursesContainer)
        return;

    coursesContainer.innerHTML =
        "";

    const title =
        document.createElement(
            "div"
        );

    title.style.gridColumn =
        "1 / -1";

    title.style.marginBottom =
        "10px";

    title.innerHTML = `

        <h3 style="margin-bottom:6px;">

            ${
                subject
                    ? "🎯 كورسات مقترحة للمادة: " +
                      escapeHTML(subject)
                    : "🎯 كورسات مقترحة حسب التراك"
            }

        </h3>

        <p style="color:var(--muted);">

            الكورسات دي اتاختارت بناءً على بياناتك الدراسية.

        </p>
    `;

    coursesContainer.appendChild(
        title
    );


    courses.forEach(course => {

        const card =
            document.createElement(
                "div"
            );

        card.className =
            "course-card";

        card.innerHTML = `

            <div class="course-icon"
                 style="font-size:30px; margin-bottom:15px;">

                <i class="fa-solid fa-graduation-cap"></i>

            </div>

            <h3>
                ${escapeHTML(
                    course.name
                )}
            </h3>

            <p style="color:var(--muted); margin:10px 0;">

                كورس مقترح ليكي 🎓

            </p>

            <a
                href="index w.html#courses"
                target="_blank"
                rel="noopener noreferrer"
                class="main-btn small-btn"
                style="display:inline-block; text-decoration:none;">

                ابدئي الكورس

            </a>

        `;

        coursesContainer.appendChild(
            card
        );

    });

}


/*
 * لا توجد نتائج
 */

function renderNoCourses(
    message
) {

    if (!coursesContainer)
        return;

    coursesContainer.innerHTML = `

        <div class="empty-state">

            <i class="fa-solid fa-graduation-cap"></i>

            <h3>
                مفيش اقتراحات حاليًا
            </h3>

            <p>
                ${escapeHTML(message)}
            </p>

            <a
                href="index w.html#courses"
                target="_blank"
                rel="noopener noreferrer"
                class="main-btn small-btn"
                style="display:inline-block; text-decoration:none; margin-top:10px;">

                استكشفي كل الكورسات

            </a>

        </div>
    `;

}


// =====================================================
// EXAMS
// =====================================================

const addExamBtn =
    document.getElementById(
        "addExamBtn"
    );

const examsContainer =
    document.getElementById(
        "examsContainer"
    );

const nextExam =
    document.getElementById(
        "nextExam"
    );


if (addExamBtn) {

    addExamBtn.addEventListener(
        "click",
        openExamModal
    );

}


function openExamModal() {

    openModal(`

        <h2>إضافة امتحان</h2>

        <form
            class="modal-form"
            id="examForm">

            <input
                type="text"
                id="examName"
                placeholder="اسم المادة"
                required>

            <input
                type="date"
                id="examDate"
                required>

            <input
                type="time"
                id="examTime">

            <button
                type="submit"
                class="main-btn">

                إضافة الامتحان

            </button>

        </form>
    `);

    const examForm =
        document.getElementById(
            "examForm"
        );

    if (!examForm) return;

    examForm.addEventListener(
        "submit",
        function (e) {

            e.preventDefault();

            const exam = {

                id: Date.now(),

                name:
                    document.getElementById(
                        "examName"
                    ).value.trim(),

                date:
                    document.getElementById(
                        "examDate"
                    ).value,

                time:
                    document.getElementById(
                        "examTime"
                    ).value

            };

            exams.push(exam);

            saveExams();
            renderExams();

            closeModalFunction();

            showNotification(
                "تمت إضافة الامتحان 📅"
            );

        }
    );

}


function saveExams() {

    localStorage.setItem(
        "studentExams",
        JSON.stringify(exams)
    );

}


function renderExams() {

    if (!examsContainer ||
        !nextExam)
        return;

    if (exams.length === 0) {

        examsContainer.innerHTML = `

            <div class="empty-state">

                <i class="fa-solid fa-calendar-days"></i>

                <h3>
                    مفيش امتحانات مضافة
                </h3>

                <p>
                    ضيفي مواعيد امتحاناتك.
                </p>

            </div>
        `;

        nextExam.innerHTML = `

            <div class="empty-state">

                <i class="fa-solid fa-calendar-days"></i>

                <p>
                    مفيش امتحانات مضافة
                </p>

            </div>
        `;

        updateStats();

        return;
    }

    examsContainer.innerHTML =
        "";

    const sortedExams =
        [...exams].sort(
            (a, b) =>
                new Date(
                    `${a.date}T${a.time || "00:00"}`
                ) -
                new Date(
                    `${b.date}T${b.time || "00:00"}`
                )
        );

    sortedExams.forEach(
        exam => {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "exam-card";

            card.innerHTML = `

                <button
                    class="card-delete"
                    onclick="deleteExam(${exam.id})">

                    <i class="fa-solid fa-trash"></i>

                </button>

                <i
                    class="fa-solid fa-calendar-days"
                    style="color:var(--primary); font-size:25px; margin-bottom:15px;">
                </i>

                <h3>
                    ${escapeHTML(
                        exam.name
                    )}
                </h3>

                <p>
                    📅 ${exam.date}
                </p>

                <p>
                    ⏰ ${
                        exam.time ||
                        "لم يتم تحديد الوقت"
                    }
                </p>

            `;

            examsContainer.appendChild(
                card
            );

        }
    );

    renderNextExam(
        sortedExams
    );

    updateStats();

}


function renderNextExam(
    sortedExams
) {

    if (!nextExam)
        return;

    const now =
        new Date();

    const upcoming =
        sortedExams.find(
            exam =>
                new Date(
                    `${exam.date}T${exam.time || "00:00"}`
                ) > now
        );

    if (!upcoming) {

        nextExam.innerHTML = `

            <div class="empty-state">

                <i class="fa-solid fa-circle-check"></i>

                <p>
                    مفيش امتحانات قادمة 🎉
                </p>

            </div>
        `;

        return;
    }

    nextExam.innerHTML = `

        <div style="text-align:center">

            <div
                style="color:var(--primary); font-size:35px; margin-bottom:10px;">

                <i class="fa-solid fa-calendar-days"></i>

            </div>

            <h3>
                ${escapeHTML(
                    upcoming.name
                )}
            </h3>

            <p
                style="color:var(--muted); margin-top:8px;">

                ${upcoming.date}

            </p>

            <div
                id="dashboardCountdown"
                style="margin-top:15px; font-weight:700; color:var(--primary);">

            </div>

        </div>
    `;

    updateDashboardCountdown(
        upcoming
    );

}


function updateDashboardCountdown(
    exam
) {

    const element =
        document.getElementById(
            "dashboardCountdown"
        );

    if (!element)
        return;

    const target =
        new Date(
            `${exam.date}T${exam.time || "00:00"}`
        );

    function update() {

        const difference =
            target - new Date();

        if (difference <= 0) {

            element.textContent =
                "الامتحان بدأ أو انتهى";

            return;
        }

        const days =
            Math.floor(
                difference /
                (1000 * 60 * 60 * 24)
            );

        const hours =
            Math.floor(
                (
                    difference /
                    (1000 * 60 * 60)
                ) % 24
            );

        const minutes =
            Math.floor(
                (
                    difference /
                    (1000 * 60)
                ) % 60
            );

        element.textContent =
            `${days} يوم • ${hours} ساعة • ${minutes} دقيقة`;

    }

    update();

    setInterval(
        update,
        60000
    );

}


function deleteExam(id) {

    exams =
        exams.filter(
            exam =>
                exam.id !== id
        );

    saveExams();
    renderExams();

    showNotification(
        "تم حذف الامتحان 🗑️"
    );

}


// =====================================================
// NOTES
// =====================================================

const addNoteBtn =
    document.getElementById(
        "addNoteBtn"
    );

const notesContainer =
    document.getElementById(
        "notesContainer"
    );


if (addNoteBtn) {

    addNoteBtn.addEventListener(
        "click",
        openNoteModal
    );

}


function openNoteModal() {

    openModal(`

        <h2>إضافة ملاحظة</h2>

        <form
            class="modal-form"
            id="noteForm">

            <input
                type="text"
                id="noteTitle"
                placeholder="عنوان الملاحظة"
                required>

            <textarea
                id="noteContent"
                rows="6"
                placeholder="اكتبي ملاحظتك هنا..."
                required>
            </textarea>

            <button
                type="submit"
                class="main-btn">

                حفظ الملاحظة

            </button>

        </form>
    `);

    const noteForm =
        document.getElementById(
            "noteForm"
        );

    if (!noteForm) return;

    noteForm.addEventListener(
        "submit",
        function (e) {

            e.preventDefault();

            const note = {

                id: Date.now(),

                title:
                    document.getElementById(
                        "noteTitle"
                    ).value.trim(),

                content:
                    document.getElementById(
                        "noteContent"
                    ).value.trim(),

                date:
                    new Date().toLocaleDateString(
                        "ar-EG"
                    )

            };

            notes.push(note);

            saveNotes();
            renderNotes();

            closeModalFunction();

            showNotification(
                "تم حفظ الملاحظة 📝"
            );

        }
    );

}


function saveNotes() {

    localStorage.setItem(
        "studentNotes",
        JSON.stringify(notes)
    );

}


function renderNotes() {

    if (!notesContainer)
        return;

    if (notes.length === 0) {

        notesContainer.innerHTML = `

            <div class="empty-state">

                <i class="fa-solid fa-note-sticky"></i>

                <h3>
                    مفيش ملاحظات
                </h3>

                <p>
                    اكتبي أي حاجة محتاجة تفتكريها.
                </p>

            </div>
        `;

        return;
    }

    notesContainer.innerHTML =
        "";

    notes.forEach(note => {

        const card =
            document.createElement(
                "div"
            );

        card.className =
            "note-card";

        card.innerHTML = `

            <button
                class="card-delete"
                onclick="deleteNote(${note.id})">

                <i class="fa-solid fa-trash"></i>

            </button>

            <i
                class="fa-solid fa-note-sticky"
                style="color:var(--primary); font-size:25px; margin-bottom:15px;">
            </i>

            <h3>
                ${escapeHTML(
                    note.title
                )}
            </h3>

            <p>
                ${escapeHTML(
                    note.content
                )}
            </p>

            <small
                style="display:block; margin-top:15px; color:var(--muted);">

                ${note.date}

            </small>

        `;

        notesContainer.appendChild(
            card
        );

    });

}


function deleteNote(id) {

    notes =
        notes.filter(
            note =>
                note.id !== id
        );

    saveNotes();
    renderNotes();

    showNotification(
        "تم حذف الملاحظة 🗑️"
    );

}


// =====================================================
// GPA
// =====================================================

const addGpaSubject =
    document.getElementById(
        "addGpaSubject"
    );

const gpaSubjects =
    document.getElementById(
        "gpaSubjects"
    );

const calculateGpa =
    document.getElementById(
        "calculateGpa"
    );

const gpaResult =
    document.getElementById(
        "gpaResult"
    );


if (addGpaSubject) {

    addGpaSubject.addEventListener(
        "click",
        function () {

            if (!gpaSubjects)
                return;

            const row =
                document.createElement(
                    "div"
                );

            row.className =
                "gpa-row";

            row.innerHTML = `

                <input
                    type="text"
                    placeholder="اسم المادة">

                <input
                    type="number"
                    placeholder="Credit Hours"
                    min="1">

                <select>

                    <option value="">
                        الدرجة
                    </option>

                    <option value="4">
                        A+
                    </option>

                    <option value="3.7">
                        A
                    </option>

                    <option value="3.3">
                        B+
                    </option>

                    <option value="3">
                        B
                    </option>

                    <option value="2.7">
                        C+
                    </option>

                    <option value="2.3">
                        C
                    </option>

                    <option value="2">
                        D+
                    </option>

                    <option value="1.7">
                        D
                    </option>

                    <option value="0">
                        F
                    </option>

                </select>
            `;

            gpaSubjects.appendChild(
                row
            );

        }
    );

}


if (calculateGpa) {

    calculateGpa.addEventListener(
        "click",
        function () {

            const rows =
                document.querySelectorAll(
                    ".gpa-row"
                );

            let totalPoints = 0;
            let totalHours = 0;

            rows.forEach(
                row => {

                    const inputs =
                        row.querySelectorAll(
                            "input"
                        );

                    const select =
                        row.querySelector(
                            "select"
                        );

                    const hours =
                        parseFloat(
                            inputs[1]?.value
                        );

                    const grade =
                        parseFloat(
                            select?.value
                        );

                    if (
                        !isNaN(hours) &&
                        !isNaN(grade)
                    ) {

                        totalHours +=
                            hours;

                        totalPoints +=
                            hours *
                            grade;

                    }

                }
            );

            if (totalHours === 0) {

                alert(
                    "دخلي Credit Hours والدرجات الأول."
                );

                return;
            }

            const gpa =
                totalPoints /
                totalHours;

            if (gpaResult) {

                gpaResult.textContent =
                    gpa.toFixed(2);
            }

            localStorage.setItem(
                "studentGPA",
                gpa.toFixed(2)
            );

            updateStudentInterface();

            showNotification(
                "تم حساب الـ GPA 🎓"
            );

        }
    );

}


// =====================================================
// NOTIFICATIONS
// =====================================================

if (notificationBtn) {

    notificationBtn.addEventListener(
        "click",
        function () {

            if (!notificationPanel)
                return;

            notificationPanel.classList.toggle(
                "show"
            );

        }
    );

}


if (closeNotifications) {

    closeNotifications.addEventListener(
        "click",
        function () {

            if (!notificationPanel)
                return;

            notificationPanel.classList.remove(
                "show"
            );

        }
    );

}


function showNotification(
    message
) {

    const notificationsList =
        document.getElementById(
            "notificationsList"
        );

    if (!notificationsList)
        return;

    const emptyState =
        notificationsList.querySelector(
            ".empty-state"
        );

    if (emptyState)
        emptyState.remove();

    const notification =
        document.createElement(
            "div"
        );

    notification.style.padding =
        "12px";

    notification.style.borderBottom =
        "1px solid var(--border)";

    notification.style.fontSize =
        "13px";

    notification.textContent =
        message;

    notificationsList.prepend(
        notification
    );

}


// =====================================================
// STATS
// =====================================================

function updateStats() {

    const tasksCount =
        document.getElementById(
            "tasksCount"
        );

    const completedTasks =
        document.getElementById(
            "completedTasks"
        );

    const subjectsCount =
        document.getElementById(
            "subjectsCount"
        );

    const examsCount =
        document.getElementById(
            "examsCount"
        );

    if (tasksCount) {

        tasksCount.textContent =
            tasks.length;
    }

    if (completedTasks) {

        completedTasks.textContent =
            tasks.filter(
                task =>
                    task.completed
            ).length;
    }

    if (subjectsCount) {

        subjectsCount.textContent =
            subjects.length;
    }

    if (examsCount) {

        examsCount.textContent =
            exams.length;
    }

    updateProgress();

}


// =====================================================
// PROGRESS
// =====================================================

function updateProgress() {

    const progressFill =
        document.getElementById(
            "progressFill"
        );

    const overallProgress =
        document.getElementById(
            "overallProgress"
        );

    if (
        !progressFill ||
        !overallProgress
    )
        return;

    if (tasks.length === 0) {

        progressFill.style.width =
            "0%";

        overallProgress.textContent =
            "0%";

        return;
    }

    const completed =
        tasks.filter(
            task =>
                task.completed
        ).length;

    const percentage =
        Math.round(
            (
                completed /
                tasks.length
            ) * 100
        );

    progressFill.style.width =
        percentage + "%";

    overallProgress.textContent =
        percentage + "%";

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        text ?? "";

    return div.innerHTML;

}


// =====================================================
// INITIAL RENDER
// =====================================================

renderTasks();

renderSubjects();

renderExams();

renderNotes();

updateStats();

updateStudentInterface();

checkLogin();


console.log(
    "🎓 Student Life OS is running successfully!"
);
