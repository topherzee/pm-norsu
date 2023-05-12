import * as React from 'react';
import PropTypes from 'prop-types';
import Layout from "../components/layout";
import './app.css';

export default function MyApp(props) {
  const { Component, pageProps } = props;

  return (
      <Layout>
        <Component {...pageProps} />
      </Layout>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
