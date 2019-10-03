import * as express from 'express';
import blogService from './service';
import { addModificationAuditInfo, validatePagination } from '../../../core/helpers';

const blogRouter = express.Router();

blogRouter.post('/newpost', async (req, res) => {
  try {
    const result = await blogService.create(req.body);
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({
      errorMessage: err.message || 'Internal server error.'
    });
  }
});

blogRouter.put('/edit', async (req, res) => {
  try {
    const newBlog = await blogService.edit(addModificationAuditInfo(req, req.body));
    res.status(200).send(newBlog);
  } catch (err) {
    res.status(500).send({
      errorMessage: err.message || 'Internal server error.'
    });
  }
});

blogRouter.delete('/delete/', async (req, res) => {
  try {
    await blogService.deletePost(req.body.postId);
    res.status(200).end();
  } catch (err) {
    res.status(500).send({
      errorMessage: err.message || 'Internal server error.'
    });
  }
});

blogRouter.put('/deactivate/:id', async (req, res) => {
  try {
    await blogService.deactivate(req.params.id);
    res.status(200).end();
  } catch (err) {
    res.status(500).send({
      errorMessage: err.message || 'Internal server error.'
    });
  }
});

blogRouter.put('/activate/:id', async (req, res) => {
  try {
    await blogService.activate(req.params.id);
    res.status(200).end();
  } catch (err) {
    res.status(500).send({
      errorMessage: err.message || 'Internal server error.'
    });
  }
});

blogRouter.get('/getallposttitle', async (_req, res) => {
  try {
    const data = await blogService.getAllPostTitle();
    res.status(200).send(data);
  } catch (err) {
    res.status(500).send({
      errorMessage: err.message || 'Internal server error.'
    });
  }
});

blogRouter.get('/findpostbytitle', async (req, res) => {
  try {
    const data = await blogService.findPostByTitle(validatePagination(req.query));
    res.status(200).send(data);
  } catch (err) {
    res.status(500).send({
      errorMessage: err.message || 'Internal server error.'
    });
  }
});

blogRouter.get('/findpostbydate', async (req, res) => {
  try {
    const data = await blogService.findPostByDate(validatePagination(req.query.searchInput));
    res.status(200).send(data);
  } catch (err) {
    res.status(500).send({
      errorMessage: err.message || 'Internal server error.'
    });
  }
});

blogRouter.get('/getactivepost', async (req, res) => {
  try {
    const data = await blogService.getActivePost(validatePagination(req.query));
    res.status(200).send(data);
  } catch (err) {
    res.status(500).send({
      errorMessage: err.message || 'Internal server error.'
    });
  }
});

blogRouter.get('/getpostbyid/:id', async (req, res) => {
  try {
    const data = await blogService.getPostById(req.params.id);
    res.status(200).send(data);
  } catch (err) {
    res.status(500).send({
      errorMessage: err.message || 'Internal server error.'
    });
  }
});

blogRouter.get('/getpostbyfriendlyurl/:friendlyUrl', async (req, res) => {
  try {
    const data = await blogService.getPostByFriendlyUrl(req.params.friendlyUrl);
    res.status(200).send(data);
  } catch (err) {
    res.status(500).send({
      errorMessage: err.message || 'Internal server error.'
    });
  }
});

blogRouter.get('/getlastestpost', async (_req, res) => {
  try {
    const data = await blogService.getLastestPost();
    res.status(200).send(data);
  } catch (err) {
    res.status(500).send({
      errorMessage: err.message || 'Internal server error.'
    });
  }
});

export default blogRouter;