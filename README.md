# Reckoner Client for Planetary Annihilation

**Version 0.0.2**

This is a rating system for Planetary Annihilation aimed towards team games; very WIP.

It is available in both server and client mod flavors.

## Current Features
- Displays a confidence interval on each non-AI player's 5v5 Reckoner rating.

## "Bugs" that will likely never be addressed
- Will fail to identify a player on a local/dedicated server if they change their name without restarting their client

## Current Known Frontend Bugs
- Doesn't show anything for players that have not been observed before

## Upcoming Features (supported already by backend; currently missing from frontend)
- Display ratings based off of context (1v1, 5v5, 10-player FFA, 3v3v3, 3v7, etc)
- Display estimated win chances for each team
- Display ratings for AIs


## The Reckoner Rating System

The Reckoner Rating System is a semi-parametric bayesian system designed to estimate players' skill levels in games where players of vastly differing skill levels often encounter each other.

More info will eventually be found at https://github.com/Thalassocracy/Reckoner.jl, which is a repository containing a Julia-based framework for defining arbitrary Reckoner-based systems.

Reckoner.jl will eventually be documented further.

## ReckonerPA

ReckonerPA is a PA-specific implementation of Reckoner based on Reckoner.jl. It lives at http://pa.reckoner.info.

An outdated form of its code can be found at https://github.com/Thalassocracy/ReckonerPA.

More documentation will be available in the future.

### Data Sources

ReckonerPA currently draws its data from 3 active sources, 1 legacy source, and 1 backup source.

Additionally, there are plans in the future to add 2 more active sources and 5 more legacy sources,

A more in-depth explanation of what each source brings to Reckoner will eventually be added.


#### Active Sources
- SuperStats
- PA Inc Replayfeed API
- PA Inc Gamefeed API
- *palobby.com/replays*
- *a manual corrections document*

#### Legacy Sources
- River's Ladder
- *a pre-Titans Pastats backup*
- *Exodus Tournaments*
- *private server replayinfo.json documents*
- *a list of manually-recorded games*
- *Selected Challonge Tournaments*

#### Backup Sources
- Recorder (a legacy replayfeed archive)