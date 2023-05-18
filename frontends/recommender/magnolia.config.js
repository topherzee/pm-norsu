import Basic from "./templates/pages/Basic";
import RecommendationForm from "./templates/components/recommendation/RecommendationForm";
import Latest from "./templates/components/Latest";
import Hero from "./templates/components/Hero";

const config = {
  componentMappings: {
    "recommend-lm:pages/basic": Basic,

    "recommend-lm:components/recommendationForm": RecommendationForm,
    "recommend-lm:components/hero": Hero,
    "recommend-lm:components/latest": Latest,
  },
};

export default config;
