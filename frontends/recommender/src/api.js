const HOST = process.env.NEXT_PUBLIC_MGNL_HOST;

const GENRES_URL = HOST + "/delivery/genres/v1";
const MEDIA_TYPES_URL = HOST + "/delivery/types/v1";
const RECOMMENDATIONS_BY_TYPE_URL = HOST + "/delivery/recommendations/v1";
const SUB_ID = process.env.NEXT_PUBLIC_MGNL_SUB_ID;
const H = { headers: { "X-subid-token": SUB_ID } };

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
    var url = MEDIA_TYPES_URL + "?@jcr:uuid=" + type;
    url = url + "&subid_token=" + SUB_ID;
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
      const url =
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
          mediaType["@id"] +
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
