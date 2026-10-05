/* =========================================================
   PAGINATION — NUMBERED PAGES
   One pager per list. Newest items first.
   ========================================================= */

function createPaginatedRenderer(config) {

    const container = document.getElementById(config.containerId);
    const counter   = config.counterId
        ? document.getElementById(config.counterId)
        : null;
    const pagerBox  = config.pagerId
        ? document.getElementById(config.pagerId)
        : null;

    const perPage = config.perPage || 10;

    let allItems = [];
    let renderItem = null;
    let currentPage = 1;


    /* ---------- Public API ---------- */

    function setItems(items, render) {

        allItems = items;
        renderItem = render;
        currentPage = 1;

        renderCurrent();

    }


    function goToPage(page) {

        const totalPages = Math.max(
            1,
            Math.ceil(allItems.length / perPage)
        );

        currentPage = Math.min(Math.max(page, 1), totalPages);

        renderCurrent();

        /* Scroll list into view */

        if (container) {
            container.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }

    }


    function renderCurrent() {

        if (!container) {
            return;
        }


        /* ---------- Empty ---------- */

        if (allItems.length === 0) {

            container.innerHTML = "";

            if (counter) counter.textContent = "";
            if (pagerBox) pagerBox.innerHTML = "";

            return;

        }


        /* ---------- Slice ---------- */

        const totalPages = Math.ceil(allItems.length / perPage);
        const start = (currentPage - 1) * perPage;
        const end   = start + perPage;

        const pageItems = allItems.slice(start, end);

        container.innerHTML =
            pageItems.map(renderItem).join("");


        /* ---------- Counter ---------- */

        if (counter) {

            counter.textContent =
                allItems.length <= perPage
                    ? `${allItems.length} ${
                          allItems.length === 1 ? "item" : "items"
                      }`
                    : `Showing ${start + 1}–${Math.min(end, allItems.length)} of ${allItems.length}`;

        }


        /* ---------- Page buttons ---------- */

        if (pagerBox) {
            pagerBox.innerHTML = renderPager(totalPages);
            wirePager(pagerBox);
        }

    }


    function renderPager(totalPages) {

        if (totalPages <= 1) {
            return "";
        }


        const buttons = [];


        /* Prev */

        buttons.push(`
            <button
                type="button"
                class="page-btn page-prev"
                data-page="${currentPage - 1}"
                ${currentPage === 1 ? "disabled" : ""}
            >
                Prev
            </button>
        `);


        /* Page numbers with … for gaps */

        const pages = buildPageList(currentPage, totalPages);

        pages.forEach(function (p) {

            if (p === "…") {

                buttons.push(`
                    <span class="page-ellipsis">…</span>
                `);

            } else {

                buttons.push(`
                    <button
                        type="button"
                        class="page-btn ${p === currentPage ? "active" : ""}"
                        data-page="${p}"
                    >
                        ${p}
                    </button>
                `);

            }

        });


        /* Next */

        buttons.push(`
            <button
                type="button"
                class="page-btn page-next"
                data-page="${currentPage + 1}"
                ${currentPage === totalPages ? "disabled" : ""}
            >
                Next
            </button>
        `);


        return buttons.join("");

    }


    function buildPageList(current, total) {

        /* Show up to 7 slots. Use … to compress gaps. */

        const maxSlots = 7;


        if (total <= maxSlots) {

            return Array.from({ length: total }, (_, i) => i + 1);

        }


        const result = [];


        /* Always: 1 */
        result.push(1);


        let left  = Math.max(2, current - 1);
        let right = Math.min(total - 1, current + 1);


        /* If close to start, extend right side */
        if (current <= 3) {
            left  = 2;
            right = 4;
        }

        /* If close to end, extend left side */
        if (current >= total - 2) {
            left  = total - 3;
            right = total - 1;
        }


        if (left > 2) result.push("…");

        for (let i = left; i <= right; i++) {
            result.push(i);
        }

        if (right < total - 1) result.push("…");


        /* Always: total */
        result.push(total);


        return result;

    }


    function wirePager(pager) {

        pager
            .querySelectorAll("button[data-page]")
            .forEach(function (btn) {

                btn.addEventListener("click", function () {

                    const page = Number(btn.dataset.page);

                    if (!isNaN(page)) {
                        goToPage(page);
                    }

                });

            });

    }


    return {
        setItems,
        goToPage,
        renderCurrent
    };

}


/* =========================================================
   SORT HELPER — newest first
   ========================================================= */

function sortByNewest(items, dateField) {

    return items.slice().sort(function (a, b) {

        const da = new Date(
            a[dateField] ||
            a.postedAt ||
            a.postedDate ||
            a.appliedDate ||
            a.createdAt ||
            0
        ).getTime();

        const db = new Date(
            b[dateField] ||
            b.postedAt ||
            b.postedDate ||
            b.appliedDate ||
            b.createdAt ||
            0
        ).getTime();

        return db - da;

    });

}