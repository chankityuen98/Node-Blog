const express = require('express');
const router = express.Router();
const Post = require('../models/Post')

// GET / HOME
router.get('', async (req,res)=>{

    try {
        const locals = {
            title: 'NodeJs Blog',
            description: 'Simple blog build with NodeJs, Express & MongoDB'
        }

        let perPage = 10;
        let page = req.query.page || 1;
    
        const data = await Post.aggregate([ { $sort: { createdAt: -1 } } ])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();
    
        // Count is deprecated - please use countDocuments
        // const count = await Post.count();
        const count = await Post.countDocuments({});
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);
    
        res.render('index', { 
          locals,
          data,
          current: page,
          nextPage: hasNextPage ? nextPage : null,
          currentRoute: '/'
        });
    } catch (error) {
        console.log(error)
    }
})

// GET / Post :id
router.get('/post/:id', async (req, res)=>{
    try {
        

        let slug = req.params.id;

        const data = await Post.findById({_id: slug});

        const locals = {
            title: data.title,
            description: 'Simple blog build with NodeJs, Express & MongoDB'
        }
        res.render('post', {locals, data})

    } catch (error) {
        console.log(error)
        
    }
})

// GET / Post :id
router.post('/search', async (req, res)=>{
    try {
        const locals = {
            title: 'Search',
            description: 'Simple blog build with NodeJs, Express & MongoDB'
        }

        let searchTerm = req.body.searchTerm
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g,'')

        const data = await Post.find({
            $or: [
                {title: {$regex: new RegExp(searchNoSpecialChar, 'i')}},
                {body: {$regex: new RegExp(searchNoSpecialChar, 'i')}},
            ]
        })
       
        res.render('search',{
            data, locals
        })

    } catch (error) {
        console.log(error)
    }
})

// GET / About
router.get('/about', (req,res)=>{
    res.render('about');
})



module.exports = router;