const Tags = require("../models/tags");
const Blog = require("../models/blog");
const slugify = require("slugify");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.create = (req, res) => {
  const { name } = req.body;
  let slug = slugify(name).toLowerCase();
  let tag = new Tags({ name, slug });
  tag.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};

exports.list = (req, res) => {
  Tags.find({}).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};

exports.read = (req, res) => {
  const slug = req.params.slug.toLowerCase();

  Tags.findOne({ slug }).exec((err, tag) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    // res.json(tag);
    Blog.find({ tags: tag })
      .populate("categories", "_id name slug")
      .populate("tags", "_id name slug")
      .populate("postedBy", "_id username name")
      .select(
        "_id title slug excerpt categories tags postedBy createdAt updatedAt"
      )
      .exec((err, data) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        res.json({ tag: tag, blogs: data });
      });
  });
};

exports.remove = (req, res) => {
  const slug = req.params.slug.toLowerCase();

  Tags.findOneAndRemove({ slug }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({
      message: "Tag deleted Successfully",
    });
  });
};
