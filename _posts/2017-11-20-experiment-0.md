---
layout:  post
title:   Unreal Experiment 1.1
date:    2017-11-20 22:30:00 -0600
hero:    aud(unrl)
tagline: Step-by-step instructions to setup Unreal Engine's Modular Synth toolkit
categories: UE4 procedural audio howto
---

# Origin Story

How did I come to use Unreal instead of Unity (which seems vastly more popular)? That's an interesting story... for another post.

The über quick version is: I built a simple little [waveform generator plugin](https://github.com/bsgbryan/wavy-mcformface) and submitted it to the Asset Store. Not only did the Asset Store representantive insult me personally and professionally (after my plugin sat "waiting for review" for three full weeks with no word from Unity), they also reviewed the wrong version of my plugin. When I asked them if their insults were some sort of joke and noted that they reviewed the wrong version of my plugin (not the version I actually marked for submission) they informed me that Unity would not be accepting my plugin - and they would not accept any plugins from me at all, ever.

I've been a developer for fifteen years. I have a [little game](https://itunes.apple.com/us/app/jumpy-mcrunface/id1151471322?mt=8) in the App Store. I have never been treated so unprofessionally. My experience submitting my plugin to Unity was the final straw added to a sizable pile of problems I'd been having with Unity. I decided that I would never use the tool again and began looking for alternatives.

Unreal was, naturally, the first place I looked. I'm still terrified of C++, but after watching quite a few tutorials I'm willing to give it a try.

# Why?

What's the point of this experiment (and all those that follow)? My game, Jumpy McRunface, needs a complete rebuild. The version in the App Store now is great for what it is: a simple, fun, zen little infinite platformer. There are more things I want the game to do, though. I want the obstacles, world, and music to be rucher, more dynamic, and far more engaging.

I've already got the groundwork laid for the more engaging obstacles and world - the next item (and the impetus behind Wavy McFormace) is procedural/genarative audio.

The primary reason I decided to give Unreal a go (aside from how genrally stable and well-put-together it seems) is it's new synth audio engine.

# What's in this post?

This post will cover getting the new synth framework working and how to get a very, very basic waveform playing in-game.

I'm on a Mac, so all instructions will be macOS specific.

# Diving in

Ok, so, if you don't have Unreal installed just follow the instructions [here](https://docs.unrealengine.com/latest/INT/GettingStarted/Installation/).

With that complete, you'll want to have a look [here](https://docs.unrealengine.com/latest/INT/GettingStarted/RunningUnrealEngine/) for instructions on running Unreal Editor from the command line. This is important as the synth framework is experimental and requires a command line flag, `-audiomixer`, to be enabled.

### Uhhh, so where is UE4Editor.app?

Infuriatingly, nowhere in any of Epic's documentation is the location of the UE4Editor.app mentioned. This folder is vitally important as, if you read through the above link, you'll notice you need to execute `open UE4Editor.app --args` to open the editor from the command line.

I searched all over my file system looking for this damn thing. I ended up finding it via the ever-helpful `ps/grep` combo: `ps -axf | grep UE4Editor.app`. On my system, the output look like this:

```sh
MacBook-Pro :: ~ » ps -axf | grep UE4Editor.app
  501  8089     1   0  2:31PM ??         1:01.52 /Users/Shared/Epic Games/UE_4.18/Engine/Binaries/Mac/UE4Editor.app/Contents/MacOS/UE4Editor /Users/fo/Documents/Unreal Projects/MyProject/MyProject.uproject -EpicPortal
  501  8532  2304   0  2:32PM ttys000    0:00.01 grep --color=auto --exclude-dir=.bzr --exclude-dir=CVS --exclude-dir=.git --exclude-dir=.hg --exclude-dir=.svn UE4Editor.app
```

There are a couple important things to note about the output above:

1. Because fo the space in "Epic Games" you _MUST_ wrap the path to the `.app` file in quotes.
2. You will _NOT_ pass `-EpicPortal` to `open` when you call it.
3. The `UE_4.18` is _NOT_ the version of the engine. I have Unreal Engine 4.18.1 installed on my laptop.
4. The second file path above is the absolute path to the project you want to open. The project I am working with for this experiment is title MyProject (the default Unreal uses when you create a new project).
5. As with "Epic Game", note that I will need to wrap the path to my project in quotes when calling `open` beause of the space in "Unreal Projects".

Alrighty! So now we know where our UE4Editor.app is we have what we need to start our experiment!

### Command to start Unreal Engine with the synth framework

```sh
cd "/Users/Shared/Epic Games/UE_4.18/Engine/Binaries/Mac"
open UE4Editor.app --args "/Users/fo/Documents/Unreal Projects/MyProject/MyProject.uproject" -audiomixer
```

After executing `open` you'll see the editor (as well as the Epic Games Launcher) fire up.

### Activating synth framework

There are several config settings that needs to be enabled/updated to get the synth framework working - a couple are optional.

1. Active **Sound Utilities** Plugin
    * Open Plugins window: **Edit -> Plugins**
    * Check **Enabled** for the **Sound Utilities** plugin under **Built-In -> Audio**
2. Active the **Sythesis** Plugin
    * Still in **Built-In -> Audio**, check **Enabled** for the **Sythesis** plugin

You will need to restart the editor for these updates to take effect. I would recommend updating the below setting as well:

1. Under **Level Editor -> Miscellaneous -> Sound**
    * Uncheck **Enable Editor Sounds**
    * Check **Allow Background Audio**
2. Under **General -> Performance**
    * Uncheck **Use Less CPU when in Background**

For more details on the above, check out the [forum post](https://forums.unrealengine.com/development-discussion/audio/116874-new-audio-engine-early-access-quick-start-guide) I got all these setup instructions from.

Once all the above steps have been completed click the "Restart" button at the bottom of the Settings window.

### Actor/Blueprint setup

Now that we have the synth framework configured we need to tell configure our Actor and modify a Blueprint.

The first step is to add a **Modular Synth** component to the player controlled actor in our level. In my case I chose the Side Scroller template when I created my project. This means I have an actor named SideScrollerCharacter in my level. This is what I will add the Modular Synth component to. You could add a Modular Synth component to any actor in your level, I chose to add it to the player controlled character as it seemed the simplest route.

##### Add Modular Synth component to actor

To add the the Modular Synth component to our actor select it in the **World Outliner**. This will populate the **Details** window with our actor's properties. At the top of the Details window is the **Add Component** button. Click Add Component and enter _modular synth_ in the search field. Press Enter or click on the Modular Synth option in the list.

##### Check Auto Activate on the Modular Synth component

The top section of the Details window lists all children of our actor. Selecting the ModularSynth component changes the lower portion ofthe Details window so that it displays info about our new component.

Find the **Activation** section at the bottom of the property list. Make sure **Auto Activate** is checked. As an alternative, you add an Activate node to our actor's Blueprint. If you choose to not check Auto Activate and instead add an Activate node to the Blueprint, ensure that the Activate node is placed before your **Note On** node (more on that below).

A Modular Synth must be activated before it can produce sound. I spent some time wondering why my component seemed to be configured properly but wasn't producing sound. I stumbled onto the Auto Activate property while searching around and hope this section will save you some time :stuck_out_tongue_winking_eye:

##### Playing a note

At this point we could simply right-click on our actor in the World Outliner and select **Edit SideScrollerCharacter**. This wil open the Blueprint editor. The simplest way to get our synth producing sound is to do the following:

1. Right-click a blank area in the main Blueprint window
2. type **beginplay** in the search field
3. Press enter or select the **Event BeginPlay** from the list
4. Left-click and drag the white triangle arrow on the Event BeginPlay node to a blank area of the Blueprint
5. Enter **note on** into the search field
6. Select **Note On (ModularSynth)**

You'll see that an extra node named **Modular Synth** was added to the Blueprint as well. This is Unreal being helpful and assigning the **Target** property of our Note On node for us. The Modular Synth node is the component we added earlier. If you set the **Note** property to something like 60.0 and the **Velocity** property to something like 100.0 and click **Play** you'll hear audio.

# What's next

There is a _lot_ more to Unreal's experimental Modular Synth. In future posts I'll cover creating presets and patches for the Modular Synth.

# Until then...

Have fun!
