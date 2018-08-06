import React from "react";
import renderer from "react-test-renderer";
import {shallow} from 'enzyme';
import Feed from "./Feed";

describe("", () => {
    it("renders without crashing", () => {
        const rendered = renderer.create(<Feed />).toJSON();
        expect(rendered).toBeTruthy();
    });
});

describe("Test htmlParser logic", () => {
    it("test parser on single comment", () => {
        content = "<!-- SC_OFF --><div class=\"md\"><p>I&#39;ve created a series of tutorials on how to use NEAT (Neural Evolution of Augmenting Topologies) with Open-AI&#39;s Retro library to train a network to play basically any retro game. How well it does depends on lots of factors. I&#39;ve personally had success with Donkey Kong Country and Sonic the Hedgehog 2. </p> <p>Here&#39;s the tutorial: <a href=\"https://www.youtube.com/watch?v=CFa6NhLgeL0&amp;list=PLTWFMbPFsvz3CeozHfeuJIXWAJMkPtAdS\">https://www.youtube.com/watch?v=CFa6NhLgeL0&amp;list=PLTWFMbPFsvz3CeozHfeuJIXWAJMkPtAdS</a></p> <p>Repo: <a href=\"https://gitlab.com/lucasrthompson/Sonic-Bot-In-OpenAI-and-NEAT\">https://gitlab.com/lucasrthompson/Sonic-Bot-In-OpenAI-and-NEAT</a></p> <p>I just wanted to thank this sub for all the cool ideas. I love it here.</p> </div><!-- SC_ON --> &#32; submitted by &#32; <a href=\"https://www.reddit.com/user/wholeywoolly\"> /u/wholeywoolly </a> <br/> <span><a href=\"https://www.reddit.com/r/MachineLearning/comments/94alf1/p_sonic_the_hedgehog_bot_with_neat_and_openai/\">[link]</a></span> &#32; <span><a href=\"https://www.reddit.com/r/MachineLearning/comments/94alf1/p_sonic_the_hedgehog_bot_with_neat_and_openai/\">[comments]</a></span>"; 

       expect(Feed.htmlParser(content)).toBe(content);
    });
});
