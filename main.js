Hooks.on("renderItemSheetV2", async (app, html) => {
    const item = app.document;
    const header = html.querySelector(".window-header");
    const isOnActor = item._uuid.includes("Actor");

    if (header && isOnActor) {
        // Roll button
        const rollButton = document.createElement("button");

        rollButton.type = "button";
        rollButton.classList.add("rti-rollbutton");

        const rollIcon = document.createElement("i");
        rollIcon.classList.add("fas", "fa-dice");

        rollButton.append(rollIcon);

        rollButton.dataset.tooltip = game.i18n.localize("rti.roll");

        rollButton.addEventListener("click", (event) => {
            console.log("Button clicked");
        });


        const dataButton = document.createElement("button");

        dataButton.type = "button";
        dataButton.classList.add("rti-databutton");

        const dataIcon = document.createElement("i");
        dataIcon.classList.add("fa", "fa-info-circle");

        dataButton.append(dataIcon);

        dataButton.dataset.tooltip = game.i18n.localize("rti.data");

        dataButton.addEventListener("click", (event) => {
            console.log("Open data app", item);
        });

        const title = header.querySelector(".window-title");
       
        title.insertAdjacentElement("afterend", rollButton);
        rollButton.insertAdjacentElement("afterend", dataButton);
        
    }
});
const { api, sheets } = foundry.applications;
export class itemRollData extends foundry.applications.api.ApplicationV2 {
  constructor({item}){
    super({item});
    this.item = item;
  }
  static DEFAULT_OPTIONS = {
    window: { title: "rit.data" },
    position: {
      width: 700,
      height: 500,
    },
        position: {
      width: 550,
      height: 700,
    },
    form: {
      submitOnChange: false,
      closeOnSubmit: false,
    },
    actions: {
  };
    static PARTS = {
    main: {
      template:
        "modules/random-table-item/templates/random-table-item-data.hbs",
    },
    }
}