// const currentGitBranch = require("current-git-branch");
// const gitBranch = require("git-branch");

const HOST = process.env.NEXT_PUBLIC_MGNL_HOST_PREVIEW;

const GENRES_URL = HOST + "/delivery/genres/v1";
const MEDIA_TYPES_URL = HOST + "/delivery/types/v1";
const RECOMMENDATIONS_BY_TYPE_URL = HOST + "/delivery/recommendations/v1";

const PAGES_BASE = process.env.NEXT_PUBLIC_MGNL_PAGES_BASE;

const defaultBaseUrl = process.env.NEXT_PUBLIC_MGNL_HOST_PREVIEW;

const SUB_ID = process.env.NEXT_PUBLIC_MGNL_SUB_ID;
const H = { headers: { "X-subid-token": SUB_ID } };

const magFetch = async (envName, endpoint) => {
  console.log("magFetch:", endpoint);

  // const envName = currentGitBranch().replace("env/", "");
  // const envName = gitBranch.sync().replace("env/", "");

  // const envName = "main";
  console.log("magFetch env:", envName);

  const inPageEditor = false;
  // If 'main' environment && not in editor, get published content.
  let baseUrl = process.env.NEXT_PUBLIC_MGNL_HOST_PREVIEW;
  if (envName === "main" && !inPageEditor) {
    // Get Published content
    baseUrl = process.env.NEXT_PUBLIC_MGNL_HOST;
  }

  const url = `${baseUrl}/delivery${endpoint}`;
  const response = await fetch(url, H);
  const json = await response.json();

  // await fetch(url, H)
  //   .then((response) => {
  //     if (!response.ok) {
  //       throw response;
  //     }
  //     const json = response.json();
  //     console.log("****** magFetch:", json);
  //     return json; //we only get here if there is no error
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     return false;
  //   });

  console.log("****** magFetch:", json);
  return json;
};

export const fetchRec = async (name, envName) => {
  console.log("fetchRec path:" + name);
  const endpoint = `/recommendations/v1/${name}`;
  const json = await magFetch(envName, endpoint);
  return json;
};

export const fetchAllPages = async () => {
  console.log("fetchAllPages", H);
  const publicFetchUrl = process.env.NEXT_PUBLIC_MGNL_HOST_PREVIEW;
  const url = `${publicFetchUrl}/delivery/pagenav/v1${PAGES_BASE}@nodes`;
  console.log("url", url);
  const response = await fetch(url, H);
  const json = await response.json();
  console.log("****** json:", json);
  // json.push({ "@name": "recommend", "@path": "/recommend" });
  // json.push({ "@name": "", "@path": "/recommend" });

  return json.results;
};

export const fetchRecs = async (envName) => {
  console.log("fetchRecs");
  const url = `${defaultBaseUrl}/delivery/recommendations/v1/`;
  //console.log("url", url, H);
  const response = await fetch(url, H);
  const json = await response.json();
  //console.log("****** json:" + JSON.stringify(json, null, 2));
  return json.results;
};

export const fetchAllGenres = async () => {
  console.log("fetchALLGenres");
  const url = `${defaultBaseUrl}/delivery/genres/v1/`;
  console.log(url);
  const response = await fetch(url, H);
  const json = await response.json();
  // console.log("fetchAllGenres ****** json:" + JSON.stringify(json, null, 2));
  return json.results;
};

export const fetchGenre = async (name) => {
  console.log("fetchGenre path:" + name);
  const url = `${defaultBaseUrl}/delivery/genres/v1/${name}`;
  console.log("genre: " + url);
  const response = await fetch(url, H);
  const json = await response.json();
  return json;
};

export const fetchRecsForGenre = async (genre) => {
  console.log("fetchRecsForGenre path:" + genre);
  // TODO: Do search in a multifield when this is fixed. https://jira.magnolia-cms.com/browse/MGNLREST-699
  // const url = `${defaultBaseUrl}/delivery/recommendations/v1/?genres=${genre["@metadata"]["@id"]}`;
  // Workaround: Use a full text search.
  const url = `${defaultBaseUrl}/delivery/recommendations/v1/?q=${genre["@metadata"]["@id"]}`;
  console.log("fetchRecommendations url:" + url);
  const response = await fetch(url, H);
  const json = await response.json();
  return json.results;
};

export const fetchAllMediaTypes = async () => {
  console.log("fetchAllMediaTypes");
  const url = `${defaultBaseUrl}/delivery/types/v1/`;
  console.log(url);
  const response = await fetch(url, H);
  const json = await response.json();
  // console.log("MediaTypes ****** json:" + JSON.stringify(json, null, 2));
  return json.results;
};

export const fetchMediaType = async (name) => {
  console.log("fetchMediaType path:" + name);
  const url = `${defaultBaseUrl}/delivery/types/v1/${name}`;
  console.log("mediaType: " + url);
  const response = await fetch(url, H);
  const json = await response.json();
  return json;
};

//TODO Ordering not working. Issue in delivery endpoint.
export const fetchRecsForMediaType = async (type) => {
  const url = `${defaultBaseUrl}/delivery/recommendations/v1/?type=${type["@metadata"]["@id"]}&orderBy=mgnl:created%20desc`;
  console.log("fetchRecommendations:" + url + "&subid_token=" + SUB_ID);
  const response = await fetch(url, H);
  const json = await response.json();
  return json.results;
};

//TODO Ordering not working. Issue in delivery endpoint.
export const fetchAllRecs = async () => {
  const url = `${defaultBaseUrl}/delivery/recommendations/v1/?orderBy=mgnl:created%20desc`;
  console.log("fetchRecommendations:" + url + "&subid_token=" + SUB_ID);
  const response = await fetch(url, H);
  const json = await response.json();
  return json.results;
};

const listEntities = async (url, dataCallback) => {
  try {
    url = url + "&subid_token=" + SUB_ID;
    const list = await fetch(url).then((res) => res.json());
    if (!list.results) {
      console.error("There are results");
      dataCallback([]);
    } else {
      dataCallback(list.results);
    }
  } catch (error) {
    console.error("Request error", error);
  }
};

export const genres = (dataCallback) => {
  listEntities(GENRES_URL, dataCallback);
};

export const mediaTypes = (dataCallback) => {
  listEntities(MEDIA_TYPES_URL, dataCallback);
};

export const mediaTypeByName = (type, dataCallback) => {
  console.log("mediaTypeByName: " + type);
  if (type == "all") {
    dataCallback({ name: "All Types" });
  } else {
    listEntities(MEDIA_TYPES_URL + "?name=" + type, (list) => {
      if (!list || list.length !== 1) {
        console.error(
          "Media type not found or multiple media types found:" + type
        );
      } else {
        dataCallback(list[0]);
      }
    });
  }
};

export const mediaTypeById = async (type, dataCallback) => {
  console.log("mediaTypeByID type: " + type);
  if (type === undefined) {
    console.log("mediaTypeByID undefined");
    dataCallback({ name: "All" });
    return;
  }

  try {
    var url = MEDIA_TYPES_URL + "?@id=" + type;
    url = url + "&subid_token=" + SUB_ID;

    console.log("mediaTypeById ", url);
    const mediaTypes = await fetch(url).then((res) => res.json());
    //const mediaTypes = await fetch(url, H).then((res) => res.json());
    if (!mediaTypes.results || mediaTypes.results.length !== 1) {
      console.error(
        "Media type not found or multiple media types found: " + type
      );
    } else {
      dataCallback(mediaTypes.results[0]);
    }
  } catch (error) {
    console.error("Request error", error);
  }
};

export const latestByType = async (type, dataCallback) => {
  try {
    console.log("latestByType:" + type);
    let url = "";
    if (type) {
      url =
        RECOMMENDATIONS_BY_TYPE_URL +
        "?type=" +
        type +
        "&orderBy=mgnl:created%20desc";
    } else {
      url = RECOMMENDATIONS_BY_TYPE_URL + "?orderBy=mgnl:created%20desc";
    }
    url = url + "&subid_token=" + SUB_ID;
    const recommendations = await fetch(url).then((res) => res.json()); //TODO

    dataCallback(recommendations.results);

    // dataCallback(null);
  } catch (error) {
    console.error("Request error", error);
  }
};

export const recommendationsByTypeData = async (type, dataCallback) => {
  try {
    if (type == "all") {
      let url =
        RECOMMENDATIONS_BY_TYPE_URL + "?orderBy=mgnl:created%20desc&limit=10";
      url = url + "&subid_token=" + SUB_ID;

      const recommendations = await fetch(url).then((res) => res.json()); // TODO
      // console.log(recommendations);
      dataCallback(recommendations.results);
    } else {
      mediaTypeByName(type, async (mediaType) => {
        var url =
          RECOMMENDATIONS_BY_TYPE_URL +
          "?type=" +
          mediaType["@metadata"]["@id"] +
          "&orderBy=mgnl:created%20desc&limit=10";
        url = url + "&subid_token=" + SUB_ID;

        const recommendations = await fetch(url).then((res) => res.json()); // TODO
        // console.log(recommendations);
        dataCallback(recommendations.results);
      });
    }
  } catch (error) {
    console.error("Request error", error);
  }
};
