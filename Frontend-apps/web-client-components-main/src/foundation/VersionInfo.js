import React from 'react';
import preval from 'preval.macro';

const VersionInfo = () => {
  let buildDate = preval`module.exports = new Date();`;
  buildDate = buildDate.replace('T', ' ');
  buildDate = buildDate.substring(0, buildDate.length - 5);

  const componentsVersion = preval`
  const componentsInfo = require('../../package.json');
  module.exports = componentsInfo.version;`;

  return (
    <>
      Components Version: <strong>{componentsVersion}</strong> <br />
      Build Date: {buildDate} UTC
    </>
  );
};

export default VersionInfo;
