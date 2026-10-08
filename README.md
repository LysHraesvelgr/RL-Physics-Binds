# Binds Generator

Access the app [here][1]

## Usage

### Interval Mode
Specify minimum and maximum values for
> gamespeed \
> gravity \
> boost strength

to have a bakkesmod command made for you 
that evenly distributes the mutator over a range of keybinds

---

### Scalar Mode
An alternative that multiplies/divides the current values using two keybinds:

- **Key 1** : Decreases gamespeed/gravity, increases boost
- **Key 2** : Increases gamespeed/gravity, decreases boost
- **Key 3**: Resets all values to defaults

Enter a scalar multiplier (>1) and select which physics toggles you want:
> gamespeed \
> gravity \
> boost modifier

The generator produces two keybind commands and a reset keybind.

---

1. Click the command to copy
1. press `F6` ingame to open the bakkes console
1. paste the command and hit `enter` to apply

## Notes

- 0.666 is the official `slo mo` mutator value
    - speeds below 0.4 start to lose meaning

- 0.5 is the official `low gravity` mutator value

---
[1]: https://lyshraesvelgr.github.io/RL-Physics-Binds "binds generator"