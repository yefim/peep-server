var user = function(r) {
  return {
    user: {
      uid: r.user.uid,
      status: r.user.status
    },
    names: r.names
  };
};

module.exports = {
  user: user
};
