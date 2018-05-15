---
layout:  post
title:   Ideas for PCG stuff in the game I'm working on
date:    2018-05-15 12:00:00 -0600
hero:    IDEAS[0]
tagline: Reseaching shaders, noise, and pcg has given me some ideas...
categories: game development unity pcg noise
---

TL;DR
=====

Use 3D noise in addition to 2D noise to generate terrain. 3D noise should work very well with LOD/tessellation. The RGBA channels of the 3D noise should be able to use well-defined semantics to pack up to 256 layers of data/instructions/rules per point/region. These data/instructions/rules can be used by the pcg engine during rendering to generate output.

Why 3D noise?
=============

3D noise is exactly the same as 2D noise - except that it includes the Z axis. The extra axis allows us to store vastly more information in our map; specifically, (xy)<sup>z</sup>.

Another benfit of 3D noise is: it naturally maps to the volumetric nature of terrain. 3D noise gives us a simple, intuitive way to express rules and constraints in 3D space.

Where did this come from?
=========================

I've been working with pcg for a while now. I've been using 2D Perlin Noise and 2D masks for generating terrain. While these do work, I'm not happy with the uniform distribution of vertices along the x and z axes. The low poly look I'm going for requires vertex position variation along x and z. Additionally, I want to be able to use different sets of rules to render different materials (rocks, rollung hills, grassy plains, mountains, deserts, etc). While I imagine I could define all the rules and constraints I want using 2D maps, a 3D map seems like a much more natural fit.

Unknowns
========

I'm not sure if using 3D noise in this way has been attempted before. I've never tried it and don't have any idea if what I'm imagining will work as I expect, or work at all.

One thing I am concerned about is performance. The game I'm working on is initially targeted for mobile. Creating and processing 3D noise is definitely more expensive than going the 2D route.

I'll be sure to provide updates as I'm working.

Let's do this!
==============

Whether this will pan out or not, I'll learn a bunch of cool stuff - so let's get to it!