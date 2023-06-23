import Basic from "./pages/Basic";
import Contact from "./pages/Contact";
import Headline from "./components/Headline";
import Image from "./components/Image";
import Paragraph from "./components/Paragraph";
import Expander from "./components/Expander";
import List from "./components/List";
import Item from "./components/Item";

const config = {
  componentMappings: {
    "react-minimal-lm:pages/basic": Basic,
    "react-minimal-lm:pages/contact": Contact,

    "spa-lm:components/headline": Headline,
    "spa-lm:components/image": Image,
    "spa-lm:components/paragraph": Paragraph,
    "spa-lm:components/expander": Expander,
    "spa-lm:components/list": List,
    "spa-lm:components/listItem": Item,
  },
};

export default config;
