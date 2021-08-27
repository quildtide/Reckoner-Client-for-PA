# Reckoner Client for Planetary Annihilation

**Version 0.2.2**

This is a rating system for Planetary Annihilation aimed towards team games; very WIP.

It is available in both server and client mod flavors.

## Current Features
- Displays estimated ratings for all players in a lobby based off of specific game mode.

## Temporarily Removed Features
- No longer displays estimated total team ratings for all teams in a lobby.
- No longer displays estimated win chances for all teams in a lobby.

## "Bugs" that will likely never be addressed
- Will fail to identify a player on a local/dedicated server if they change their name without restarting their client

## The Reckoner Rating System

The Reckoner Rating System is a semi-parametric bayesian system designed to estimate players' skill levels in games where players of vastly differing skill levels often encounter each other.

More info will eventually be found at https://github.com/quildtide/Reckoner.jl, which is a repository containing a Julia-based framework for defining arbitrary Reckoner-based systems.

Reckoner.jl will eventually be documented further.

## ReckonerPA

ReckonerPA is a PA-specific implementation of Reckoner based on Reckoner.jl. It lives at http://pa.reckoner.info.

An often-outdated form of its code can be found at https://github.com/quildtide/ReckonerPA.

More documentation will be available in the future.

### Data Sources

ReckonerPA currently draws its data from 2 active sources, 2 legacy sources, 1 backup source, and 2 supplemental sources.

Additionally, there are plans in the future to add 3 more active sources and 3 more legacy sources,

A more in-depth explanation of what each source brings to Reckoner will eventually be added.


#### Active Sources
- Old PA Inc Replayfeed API
- PA Inc Gamefeed API
- *ReckonerPA Recorder2, a more accurate replayfeed archive*
- *ReckonerPA Reporter, a team composition reporting tool*
- *palobby.com/replays*

#### Legacy Sources
- SuperStats
- River's Ladder
- *a pre-Titans Pastats backup*
- *Exodus Tournaments*
- *Selected Challonge Tournaments*

#### Backup Sources
- ReckonerPA Recorder (a legacy replayfeed archive)

#### Supplemental Sources
- private server replayinfo.json documents (including several hundred AI vs AI matchups)
- a manual corrections document
- *a list of manually-recorded games*