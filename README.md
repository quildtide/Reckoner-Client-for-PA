# Reckoner Client for Planetary Annihilation

**Version 0.1.4**

This is a rating system for Planetary Annihilation aimed towards team games; very WIP.

It is available in both server and client mod flavors.

## Current Features
- Displays estimated ratings for all players in a lobby based off of specific game mode.
- Displays estimated total team ratings for all teams in a lobby.
- Displays estimated win chances for all teams in a lobby.

## "Bugs" that will likely never be addressed
- Will fail to identify a player on a local/dedicated server if they change their name without restarting their client

## Current limitations
- Ratings update at maximum once a second, and only if the amount of teams or amount of empty slots have changed.
    - If a player goes to spectator and comes back within the 1 second interval, this is enough to cause ratings to be recalculated
- AI personality (Normal, Hard, Q-Uber, etc) changes do not trigger a recalculation.
- Ratings will sometimes be calculated for strange intermediate modes (such as 4v4v1 as a third team is being added).

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