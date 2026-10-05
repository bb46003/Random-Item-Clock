<h2>Random Item Clock</h2>

Dice Clocks is a Foundry VTT module for tracking resources, durations, and countdowns using dice. Dice Clocks can represent a growing risk rather than a fixed countdown. As the clock changes, it shows players that an effect is becoming increasingly likely to occur without indicating exactly when it will happen. Unlike a traditional countdown, a clock creates uncertainty about when an event will be triggered.

A clock can be added to any item and used for things such as:

* **Weapon durability** – track damage until a weapon is destroyed.
* **Ammunition** – track remaining ammunition.
* **Food and supplies** – track rations, fuel, torches, and other resources.
* **Other effects and countdowns** – track an increasing risk of change over time.
* **Party clocks** – track resources or effects shared by the entire party.

Clocks can also be used as universal party resources. Party items can be placed in the inventory of a character representing the party.

The module is system-agnostic and can be used with any Foundry VTT game system.

### Setting Up a Random Item Clock

To set up a Random Item Clock, the GM needs to open an item from a character sheet. In the header of the item sheet, they will find an **"i"** icon.

<img width="316" height="46" alt="Random Item Clock setup button" src="https://github.com/user-attachments/assets/885f493b-a4bb-4d77-857b-d62212ccd497" />

<br>

Clicking this icon will open the clock configuration window.

<img width="528" height="584" alt="Random Item Clock configuration window" src="https://github.com/user-attachments/assets/59575895-bcd5-459f-b7a1-4a7f1f4a771e" />

<br>

Here, the GM can configure how the Random Clock will work by setting:

* **Start Dice** – the initial dice formula used by the clock.
* **End Dice** – the final dice formula the clock can reach.
* **Event** – the event that occurs when the clock is triggered:

  * Draw a result from a random table.
  * Send custom text to the chat using the text editor.
* **Dice Behavior After a Roll** – determines how the dice change after each roll:

  * Start with the Start Dice and increase toward the End Dice.
  * Start with the Start Dice and decrease toward the End Dice.
* **Target Number** – defines the number that must be rolled to trigger the event.
* **Comparison Operator** – defines how the rolled value is compared with the Target Number.

### Dice Formulas

For **Start Dice** and **End Dice**, you can select **Other**, which allows you to enter any valid Foundry VTT dice formula.

When using a custom formula, the module extracts the number immediately following the first `d` in the formula. After each roll, this number is increased or decreased by 1, depending on the selected behavior, until the End Dice value is reached.

For example:

`2d6+4` → `2d7+4` → `2d8+4`

The rest of the formula remains unchanged.

### Custom Events

A **Custom Event** allows you to display anything entered in the text editor in the chat.

The content can include plain text, macros, UUID links, or other content supported by the Foundry VTT text editor.

### Player Configuration

For players, access to the clock configuration is restricted. Players can only view the information that is intended to be visible to them.

<img width="508" height="240" alt="Player clock configuration" src="https://github.com/user-attachments/assets/949ae80a-7867-413f-96a5-c09e42383c55" />

<br>

### Using the Clock

Once a clock has been configured, a second button with a **two-dice icon** will appear in the item sheet header.

<img width="316" height="38" alt="Random Item Clock roll button" src="https://github.com/user-attachments/assets/d2313778-f3b3-4c80-b3e2-32485cd0c35f" />

<br>

Clicking this button will roll the clock.

Depending on the result, the dice will either change to the next value according to the configured behavior or reset to the **Start Dice** when the event is triggered.

The clock configuration window also displays the **last used dice formula**.

<img width="486" height="84" alt="Last used dice" src="https://github.com/user-attachments/assets/6b315c14-9456-4880-b69e-9bdb4bfd58df" />
