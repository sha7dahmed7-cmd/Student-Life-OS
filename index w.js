/* =====================================================
   COURSE SEARCH
===================================================== */

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const courseCards = document.querySelectorAll(".course-card");


function searchCourses() {

    const searchValue = searchInput.value
        .trim()
        .toLowerCase();


    courseCards.forEach(card => {

        const courseName =
            card.dataset.course.toLowerCase();

        const courseText =
            card.textContent.toLowerCase();


        const found =
            courseName.includes(searchValue) ||
            courseText.includes(searchValue);


        if (found) {

            card.classList.remove("hidden");

        } else {

            card.classList.add("hidden");

        }

    });

}


/* =====================================================
   SEARCH WHILE TYPING
===================================================== */

if (searchInput) {

    searchInput.addEventListener(
        "input",
        searchCourses
    );

}


/* =====================================================
   SEARCH BUTTON
===================================================== */

if (searchBtn) {

    searchBtn.addEventListener(
        "click",
        searchCourses
    );

}


/* =====================================================
   ENTER KEY
===================================================== */

if (searchInput) {

    searchInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                searchCourses();

            }

        }
    );

}


/* =====================================================
   COURSE LINKS
===================================================== */

const courseLinks =
    document.querySelectorAll(".course-link");


courseLinks.forEach(link => {

    link.addEventListener("click", function () {

        const url = this.getAttribute("href");


        if (
            !url ||
            url.startsWith("YOUR_")
        ) {

            return;

        }

        // الرابط يفتح مباشرة بدون أي رسالة تأكيد

    });

});