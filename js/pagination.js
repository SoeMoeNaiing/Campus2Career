/* =========================================================
   PAGINATION — LOAD MORE
   One pager per list. Newest items first.
   ========================================================= */

function createPaginatedRenderer(config) {

    const container = document.getElementById(config.containerId);
    const counter   = config.counterId
        ? document.getElementById(config.counterId)
        : null;
    const button    = config.buttonId
        ? document.getElementById(config.buttonId)
        : null;

    const perPage = config.perPage || 3;

    let allItems = [];
    let renderItem = null;
    let shown = perPage;


    function setItems(items, render) {

        allItems = items;
        renderItem = render;
        shown = perPage;

        renderCurrent();

    }


    function loadMore() {

        shown += perPage;
        renderCurrent();

    }


    function renderCurrent() {

        if (!container) {
            return;
        }


        /* ---------- Empty ---------- */

        if (allItems.length === 0) {

            container.innerHTML = "";

            if (counter) {
                counter.textContent = "";
            }

            if (button) {
                button.hidden = true;
            }

            return;

        }


        /* ---------- Render visible slice ---------- */

        const visible = allItems.slice(0, shown);

        container.innerHTML =
            visible.map(renderItem).join("");


        /* ---------- Counter ---------- */

        if (counter) {

            counter.textContent =
                allItems.length <= perPage
                    ? `${allItems.length} ${
                          allItems.length === 1 ? "item" : "items"
                      }`
                    : `Showing ${visible.length} of ${allItems.length}`;

        }


        /* ---------- Load more button ---------- */

        if (button) {

            if (shown >= allItems.length) {

                button.hidden = true;

            } else {

                button.hidden = false;

                const remaining = allItems.length - shown;

                button.textContent =
                    `Load ${Math.min(perPage, remaining)} more`;

            }

        }

    }


    /* ---------- Wire the button once ---------- */

    if (button) {

        button.addEventListener("click", loadMore);

    }


    return {
        setItems,
        loadMore,
        renderCurrent
    };

}


/* =========================================================
   SORT HELPERS
   Newest first.
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