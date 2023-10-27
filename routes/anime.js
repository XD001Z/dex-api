const router = require('express').Router();
const Anime = require('../models/Anime.model');
const User = require('../models/User.model');
const Comment = require('../models/Comment.model');
const { isAuthenticated } = require('../middleware/isAuthenticated');

router.use(isAuthenticated);

router.post('/find-one', (req, res, next) => {
    const { name } = req.body;
    Anime.findOne({$or:[{'name':name}, {'alt': name}]})
    .then((anime) => {
        if (!anime) {
            return res.status(404).json({ message: "Not in Dex" });
        }
        User.findById(req.tokenInfo)
        .then((user) => {
            const { _id } = anime;
            if (user.registered.includes(_id)) {
                return res.status(400).json({ message: "Already registered" });
            }
            user.update({registered: [_id, ...user.registered]})
            .then((updatedUser) => {
                console.log(anime)
                res.status(200).json(anime);
            })
            .catch((error) => {
                console.log(error);
                res.status(500).json({ message: "Internal Server Error" })
            })
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ message: "Internal Server Error" });
        });
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    });
});

router.get('/:id', (req, res, next) => {
    const { id } = req.params;
    Anime.findById(id).populate("comments")
    .then((anime) => {
        res.status(200).json(anime);
    })  
    .catch((error) => {
        res.status(500).json({ message: "Internal Server Error" });
    });
});

router.post('/:animeid/comment/add', (req, res, next) => {
    const { animeid } = req.params;
    Comment.create({text: req.body.comment, owner: req.tokenInfo})
    .then((createdComment) => {
              return Anime.findByIdAndUpdate(animeid, {$push: {comments: createdComment._id}})
    })
    .then((updatedAnime) => {
       
        Anime.findById(animeid)
        .populate('comments')
        .then((anime) => {
            res.status(201).json(anime);
        })
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" })
    });
});

router.put("/:animeId/comment/:commentId/edit", async (req, res) => {
    const {animeId, commentId} = req.params
    try {
        await Comment.findByIdAndUpdate(commentId, {text: req.body.comment})

        const anime = await Anime.findById(animeId).populate("comments")


        return res.status(200).json(anime)
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
})

router.delete("/:animeId/comment/:commentId/delete", async (req, res) => {
    const { animeId, commentId} = req.params
    try {
        const anime = await Anime.findById(animeId)
        const comment = await Comment.findById(commentId)
    
        anime.comments = anime.comments.filter((comment) => String(comment) !== commentId)
    
        await comment.delete()
       
    
        await anime.save()
    
        return res.status(200).json(anime);
        
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
})

module.exports = router;