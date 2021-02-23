# CHANGELOG

## 0.1.8 Client / 0.1.9 Server
Loading symbols next to players have been replaced with text to avoid confusion.

## 0.1.6 Client / 0.1.8 Server
Reckoner now shows loading symbols next to ratings when they are not yet fully updated.
Fixed a bug causing Reckoner to do about double the necessary work in order to update.

## 0.1.5
Default rating has been shifted from 1500 to 0.

## 0.1.4
Reckoner should now be more responsive to lobby state changes.

## 0.1.3
Fixed the following bugs:
- Intervals are no longer halved
- Correctly shows 2 digits after decimal now
- Ratings are now assigned to the correct player in a custom server

## 0.1.2
Fixed bug that occured when a player had a fully numeric name on a custom server (thanks O84!)

## 0.1.1
Multiplied displayed win chances by 100 so win_chances sum to 100% instead of 1.

## 0.1.0
Implemented the following features:
- AI ratings
- Total team strength
- Team win chance

## 0.0.6
Actually implemented the changes described in 0.0.5

## 0.0.5
Reckoner client now sends requests to server at maximum frequency of once every 2.5 seconds.

## 0.0.4
Fixed an async issue causing player ratings to not refresh properly when they join a lobby.

## 0.0.3
Fixed an async issue causing player ratings to be duplicated and assigned to the wrong player in a local/dedicated server lobby.

## 0.0.2
Added support for local/dedicated server lobbies.

Ratings now refresh in response to lobby changes instead of once every 15 seconds.

## 0.0.1
It's the first version, innit?