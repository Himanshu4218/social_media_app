import express from 'express';
import axios from 'axios';
import {  validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';
import normalize from 'normalize-url'
import mongoose from 'mongoose';
import User from '../models/userModel.js';
import Post from '../models/postModel.js';
import Profile from '../models/profileModel.js';

const router = express.Router(); 

// @route    GET api/profile/me
// @desc     Get current users profile
// @access   Private
export const getUserProfile = asyncHandler(async (req, res) => {
    try {
      const profile = await Profile.findOne({ user: req.user.id }).populate(
        'user',
        ['name', 'avatar']
      );
  
      if (!profile) {
        return res.status(400).json({ msg: 'There is no profile for this user' });
      }
  
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});


// @route    POST api/profile
// @desc     Create or update user profile
// @access   Private

export const updateUserProfile = asyncHandler(async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
       // destructure the request
      const {
        website,
        skills,
        youtube,
        twitter,
        instagram,
        linkedin,
        facebook,
        // spread the rest of the fields we don't need to check
        ...rest
      } = req.body;

      // build a profile
      const profileFields = {
        user: req.user.id,
        website:
          website && website !== ''
            ? normalize(website, { forceHttps: true })
            : '',
        skills: Array.isArray(skills)
          ? skills
          : skills.split(',').map((skill) => skill.trim()),
        ...rest
      };
      // Build socialFields object
      const socialFields = { youtube, twitter, instagram, linkedin, facebook };

      // normalize social fields to ensure valid url
      for (const [key, value] of Object.entries(socialFields)) {
        if (value && value.length > 0)
          socialFields[key] = normalize(value, { forceHttps: true });
      }
      // add to profileFields
      profileFields.social = socialFields;
  
      try {
        //find one and update without use find and modify equals false is depreceated
        // Using upsert option (creates new doc if no match is found):
        let profile = await Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true, upsert: true,setDefaultsOnInsert: true },
        );
        res.json(profile);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    }
);

// @route    GET api/profile
// @desc     Get all profiles
// @access   Public
export const getAllUsers = asyncHandler(async (req, res) => {
    try {
      const profiles = await Profile.find().populate('user', ['name', 'avatar']);
      res.json(profiles);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  
  // @route    GET api/profile/user/:user_id
  // @desc     Get profile by user ID
  // @access   Public
export const getProfileById = asyncHandler(async (req, res) => {
    try {
      const profile = await Profile.findOne({
        user: req.params.user_id 
      }).populate('user', ['name', 'avatar']);
  
      if (!profile) return res.status(400).json({ msg: 'Profile not found' });
  
      res.json(profile);
    } catch (err) {
        console.error(err.message);
        // Check if the ID is valid
        const valid = mongoose.Types.ObjectId.isValid(req.params.user_id );
        if (!valid) {
        return res.status(400).json({ msg: 'Profile not found' });
        }
        res.status(500).send('Server Error');
    }
  });

// @route    DELETE api/profile
// @desc     Delete profile, user & posts
// @access   Private
export const deleteProfile = asyncHandler(async (req, res) => {
    try {
      //  remove users posts
      await Post.deleteMany({ user: req.user.id });
      // Remove profile
      await Profile.findOneAndDelete({ user: req.user.id });
      // Remove user
      await User.findOneAndDelete({_id: req.user.id });
  
      res.json({ msg: 'User deleted' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});

// @route    PUT api/profile/experience
// @desc     Add profile experience
// @access   Private

export const addProfileExperience =  asyncHandler(async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
      } = req.body;
  
      const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
      };
  
      try {
        const profile = await Profile.findOne({ user: req.user.id });
  
        profile.experience.unshift(newExp);
  
        await profile.save();
  
        res.json(profile);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    }
);

// @route    DELETE api/profile/experience/:exp_id
// @desc     Delete experience from profile
// @access   Private
export const deleteProfileExperience = asyncHandler(async (req, res) => {
    try {
        const foundProfile = await Profile.findOne({ user: req.user.id });
    
        // Filter exprience array using_id (NOTE:_id is a BSON type needs to be converted to string)
        // This can also be omitted and the next line and findOneAndUpdate to be used instead (above implementation)
        foundProfile.experience = foundProfile.experience.filter(exp => exp._id.toString() !== req.params.exp_id);
            
        await foundProfile.save();
        return res.status(200).json(foundProfile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});
 // @route    PUT api/profile/education
// @desc     Add profile education
// @access   Private
export const addProfileEducation = asyncHandler(async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
      } = req.body;
  
      const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
      };
  
      try {
        const profile = await Profile.findOne({ user: req.user.id });
  
        profile.education.unshift(newEdu);
  
        await profile.save();
  
        res.json(profile);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    }
);
  
// @route    DELETE api/profile/education/:edu_id
// @desc     Delete education from profile
// @access   Private
export const deleteProfileEducation = asyncHandler(async (req, res) => {
    try {
        const foundProfile = await Profile.findOne({ user: req.user.id });
        foundProfile.education = foundProfile.education.filter(
            edu => edu._id.toString() !== req.params.edu_id
        );
        await foundProfile.save();
        return res.status(200).json(foundProfile);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Server error" });
    }
});


// @route    GET api/profile/github/:username
// @desc     Get user repos from Github
// @access   Public
export const getUserGithub = asyncHandler(async (req, res) => {
  try {
    const uri = encodeURI(
      `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
    );
    const headers = {
      'user-agent': 'node.js',
      Authorization: `token ${process.env.GITHUB_TOKEN}`
    };

    const gitHubResponse = await axios.get(uri, { headers });
    return res.json(gitHubResponse.data);
  } catch (err) {
    console.error(err.message);
    return res.status(404).json({ msg: 'No Github profile found' });
  }
});

export default router;