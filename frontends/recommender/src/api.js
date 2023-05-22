// const currentGitBranch = require("current-git-branch");
// const gitBranch = require("git-branch");

const HOST = process.env.NEXT_PUBLIC_MGNL_HOST_PREVIEW;

const GENRES_URL = HOST + "/delivery/genres/v1";
const MEDIA_TYPES_URL = HOST + "/delivery/types/v1";
const RECOMMENDATIONS_BY_TYPE_URL = HOST + "/delivery/recommendations/v1";

const defaultBaseUrl = process.env.NEXT_PUBLIC_MGNL_HOST_PREVIEW;

const SUB_ID = process.env.NEXT_PUBLIC_MGNL_SUB_ID;
const H = { headers: { "X-subid-token": SUB_ID } };

const magFetch = async (endpoint) => {
  console.log("magFetch:", endpoint);

  //TODO: How to detect if in pages app - seems like we need Next Context to know.
  const inPageEditor = true;

  const envName = process.env.GIT_BRANCH.replace("env/", "");
  // const envName = "main";
  console.log("magFetch env:", envName);

  // If 'main' environment && not in editor, get published content.
  let baseUrl = process.env.NEXT_PUBLIC_MGNL_HOST_PREVIEW;
  if (envName === "main" && !inPageEditor) {
    // Get Published content
    baseUrl = process.env.NEXT_PUBLIC_MGNL_HOST;
  }
  // baseUrl = process.env.NEXT_PUBLIC_MGNL_HOST_PREVIEW;

  const url = `${baseUrl}/delivery${endpoint}`;
  console.log("magFetch url:", url);
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

  // console.log("****** magFetch:", json);
  return json;
};

export const fetchAllPages = async () => {
  console.log("fetchAllPages", H);
  const endpoint = `/pagenav/v1${process.env.NEXT_PUBLIC_MGNL_PAGES_BASE}@nodes`;
  const json = await magFetch(endpoint);
  console.log("****** json:", json);
  return json.results;
};

export const fetchRec = async (name) => {
  console.log("fetchRec path:" + name);
  const endpoint = `/recommendations/v1/${name}`;
  const json = await magFetch(endpoint);
  return json;
};

export const fetchRecs = async () => {
  console.log("fetchRecs");
  const endpoint = `/recommendations/v1/`;
  const json = await magFetch(endpoint);

  //console.log("****** json:" + JSON.stringify(json, null, 2));
  return json.results;
};

export const fetchAllGenres = async () => {
  console.log("fetchALLGenres");
  const endpoint = `/genres/v1/`;
  const json = await magFetch(endpoint);
  // console.log("fetchAllGenres ****** json:" + JSON.stringify(json, null, 2));
  return json.results;
};

export const fetchGenre = async (name) => {
  console.log("fetchGenre path:" + name);
  const endpoint = `/genres/v1/${name}`;
  const json = await magFetch(endpoint);
  return json;
};

export const fetchRecsForGenre = async (genreId) => {
  console.log("fetchRecsForGenre id:", genreId);
  // TODO: Do search in a multifield when this is fixed. https://jira.magnolia-cms.com/browse/MGNLREST-699
  // const endpoint = `recommendations/v1/?genres=${genreId}`;
  // Workaround: Use a full text search.
  const endpoint = `/recommendations/v1/?q=${genreId}`;
  const json = await magFetch(endpoint);
  return json.results;
};

export const fetchAllMediaTypes = async () => {
  console.log("fetchAllMediaTypes");
  const endpoint = `/types/v1`;
  const json = await magFetch(endpoint);
  return json.results;
};

export const fetchMediaType = async (name) => {
  console.log("fetchMediaType path:" + name);
  const endpoint = `/types/v1/${name}`;
  const json = await magFetch(endpoint);
  return json;
};

//TODO Ordering not working. Issue in delivery endpoint.
export const fetchRecsForMediaType = async (typeId) => {
  console.log("fetchRecsForMediaType:", typeId);
  const endpoint = `/recommendations/v1/?type=${typeId}&orderBy=mgnl:created%20desc`;
  const json = await magFetch(endpoint);
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
