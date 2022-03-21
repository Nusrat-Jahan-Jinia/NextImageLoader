import GhostContentAPI from "@tryghost/content-api";
export function get_api() {
  const api = new GhostContentAPI({
    url: process.env.NEXT_PUBLIC_BLOG_URL,
    key: process.env.NEXT_PUBLIC_CONTENT_API_KEY,
    version: process.env.NEXT_PUBLIC_VERSION,
  });
  return api;
}

export function genStaticPagePaths(totalPages) {
  let paths = [];
  for (let i = 0; i < totalPages; i++) {
    paths.push({
      params: { page: String(i + 1) },
    });
  }
  return paths;
}

export function getStaticIDPaths(ids) {
  let paths = ids.map((item) => {
    return { params: { id: String(item.id) } };
  });
  return paths;
}

// By custom item per page
export function genCustomPageStaticPaths(totalItems, itemsPerPage) {
  let paths = [];
  let count = Math.trunc(totalItems / itemsPerPage);
  if (totalItems % itemsPerPage) count++;
  // map data to an array of path objects with params (id)
  for (let i = 0; i < count; i++) {
    paths.push({
      params: { page: String(i + 1) },
    });
  }
  return paths;
}

export const getAllPostCount = async (
  postTag,
  filterString = "",
  limitValue = "15"
) => {
  let pageCount = await get_api()
    .posts.browse({
      filter: "tag:" + postTag + filterString,
      fields: "id",
      limit: limitValue,
    })
    .then((posts) => {
      return posts.meta.pagination.pages;
    })
    .catch((err) => {
      console.error("Ghost response: " + err.errorType);
      return null;
    });
  return pageCount !== null ? pageCount : null;
};

export const getAllPostIDs = async (
  postTag,
  filterString = "",
  limitValue = "all"
) => {
  let ids = await get_api()
    .posts.browse({
      filter: "tag:" + postTag + filterString,
      fields: "id",
      limit: limitValue,
    })
    .then((posts) => {
      return posts;
    })
    .catch((err) => {
      console.error("Ghost response: " + err.errorType);
      return null;
    });
  return ids !== null ? ids : null;
};

export const getPageDataByID = async (Id) => {
  let pageData = await get_api()
    .posts.read({ id: String(Id), include: "tags" })
    .then((page) => {
      return page;
    })
    .catch((err) => {
      console.error("Ghost response: " + err.errorType);
      return null;
    });
  return pageData;
};

export const getPageDataBySlug = async (page_slug) => {
  let pageData = await get_api()
    .pages.read({ slug: page_slug })
    .then((page) => {
      return page;
    })
    .catch((err) => {
      console.error(err);
      return null;
    });
  return pageData;
};

export const getPosts = async (config) => {
  let pageData = await get_api()
    .posts.browse(config)
    .then((posts) => {
      return posts;
    })
    .catch((err) => {
      console.error(err);
      return null;
    });
  return pageData;
};

export const getNextPrevIDs = async (Id) => {
  let targetPostTime = await get_api()
    .posts.read({ id: String(Id) })
    .then((page) => {
      return page.published_at;
    })
    .catch((err) => {
      console.error("Ghost response: " + err.errorType);
      return null;
    });
  if (targetPostTime === null) {
    return null;
  }
  let prev = await get_api()
    .posts.browse({
      filter: "tag:people+published_at:>'" + String(targetPostTime) + "'",
      order: "published_at ASC",
      fields: "id",
      limit: "1",
    })
    .then((posts) => {
      return posts[0] ? posts[0] : null;
    })
    .catch((err) => {
      console.error("Ghost response: " + err.errorType);
      return null;
    });

  let next = await get_api()
    .posts.browse({
      filter: "tag:people+published_at:<'" + String(targetPostTime) + "'",
      order: "published_at DESC",
      fields: "id",
      limit: "1",
    })
    .then((posts) => {
      return posts[0] ? posts[0] : null;
    })
    .catch((err) => {
      console.error("Ghost response: " + err.errorType);
      return null;
    });
  return { prev: prev, next: next };
};
