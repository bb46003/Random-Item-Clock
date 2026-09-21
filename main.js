
const MODULE_ID = "random-table-item"
const { HTMLField } = foundry.data.fields;

Hooks.once("init", function () {
  registerHandlebarsHelpers()
})

Hooks.on("renderItemSheetV2", async (app, html) => {
    const item = app.document;
    const header = html.querySelector(".window-header");
    const isOnActor = item._uuid.includes("Actor");
    const butonExist = html.querySelector(".rti-rollbutton") && html.querySelector(".rti-databutton")
    if (header && isOnActor && !butonExist) {

      const uiConfig = game.settings.get("core", "uiConfig");
      const theme = uiConfig.colorScheme.interface;

      const rollButton = document.createElement("button");
      rollButton.type = "button";
      rollButton.classList.add("rti-rollbutton", theme);

      const rollIcon = document.createElement("i");
      rollIcon.classList.add("fas", "fa-dice");
      rollButton.append(rollIcon);

      rollButton.dataset.tooltip = game.i18n.localize("rti.roll");
      rollButton.addEventListener("click", (event) => {
        console.log("Button clicked");
      });

      const dataButton = document.createElement("button");
      dataButton.type = "button";
      dataButton.classList.add("rti-databutton", theme);
      
      const dataIcon = document.createElement("i");
      dataIcon.classList.add("fa", "fa-info-circle");
      dataButton.append(dataIcon);

      dataButton.dataset.tooltip = game.i18n.localize("rti.data");
      dataButton.addEventListener("click", (event) => {
        const data = new itemRollData(item);
        data.render({force:true})
      });

      const title = header.querySelector(".window-title");
      title.insertAdjacentElement("afterend", rollButton);
      rollButton.insertAdjacentElement("afterend", dataButton);
        
    }
});

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ApplicationV2 } = foundry.applications.api;

export class itemRollData extends HandlebarsApplicationMixin(ApplicationV2){
  constructor(item){
    super({item});
    this.item = item;
  }
  static DEFAULT_OPTIONS = {
    window: { 
      title: "rit.data",
      contentClasses: ["rit"]
    },
    position: {
      width: 500,
    },
    form: {
      submitOnChange: false,
      closeOnSubmit: false,
    },
    actions: {}

  }
  static PARTS = {
    main: {
      template:
        "modules/random-table-item/templates/random-table-item-data.hbs",
    },
  } 
  
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const dice = ["d4","d6", "d8", "d10", "d12", "d20", "d100", game.i18n.localize("rit.other") ];
    const flags = this.item.flags[MODULE_ID];
    if(flags){
      context.selectedStart = flags.start_dice;
      context.custemStart = flags.useCustomStart
      context.selectedEnd = flags.end_dice
      context.custemEnd = flags.useCustomEnd
      context.differentDice = flags.start_dice !== flags.end_dice;
      context.selectedRandomTable = flags.randomTable;
      context.targetNumber = flags.targetNumber;
      context.direction = flags.direction
      context.custom = game.i18n.localize("rit.other");      
      const rawText = flags.ownText ?? "";
      const enrichedText = await enrich(rawText);
      context.text =  {
        value: rawText,
        enriched: enrichedText,
        field: new HTMLField({
          required: false,
          nullable: true,
        }),
      }
    }
    context.randomTable = await this._prepareRandomTable()
    context.currentDice = flags?.currentDice ?? game.i18n.localize("rit.notRolled");
    context.dice = dice
    context.isGM = game.user.isGM;
    context.ownEvent = flags?.ownEvent ?? true;
    return context
  }
  async _prepareRandomTable() {
    const allTables = game.tables;

    const tableData = [
      {
        uuid: "none",
        name: game.i18n.localize("rit.ownEvent")
      },
      ...allTables.map((table) => ({
        uuid: table.uuid,
        name: table.name
      }))
    ];

    return tableData;
  }
  async _onRender(context, options) {
    await super._onRender(context, options);
    const element = this.element;
    const selectors = element.querySelectorAll("select");
    const inputs = element.querySelectorAll("input");
    selectors.forEach(selector => {
      selector.addEventListener("change", async () => {
       await this._updateOptions(selector);
       this.render()
      });
    })
    inputs.forEach(async input =>{
      await this._updateInput(input);
      input.addEventListener("input", async () =>{
        await this._updateInput(input);
      })
      input.addEventListener("change", async () =>{
        this.render()
      })
    })
    element.addEventListener("save", async (event) => {
      const textValue = event.target.value;
      await this.item.update({
        [`flags.${MODULE_ID}.ownText`]: textValue
      })
      this.render()
    })
  }
  async _updateOptions(selector){
    const id = selector.id;
    const item = this.item;
    const value = selector.value;
    if(value !== game.i18n.localize("rit.other") ){
      await item.update({
        [`flags.${MODULE_ID}.${id}`]: value
      })
      if(id.includes("start")){
        await item.update({
          [`flags.${MODULE_ID}.useCustomStart`]: false
        })
      }
      if(id.includes("end")){
        await item.update({
          [`flags.${MODULE_ID}.useCustomEnd`]: false
        })
      }
    }
    else{
      if(id.includes("start")){
        await item.update({
          [`flags.${MODULE_ID}.useCustomStart`]: true
        })
      }
      if(id.includes("end")){
        await item.update({
          [`flags.${MODULE_ID}.useCustomEnd`]: true
        })
      }
    }
    if(id === "randomTable" && value === "none"){
      await item.update({
        [`flags.${MODULE_ID}.ownEvent`]: true
      })
    }
    if(id === "randomTable" && value !== "none"){
      await item.update({
        [`flags.${MODULE_ID}.ownEvent`]: false
      });
       await this.item.update({
        [`flags.${MODULE_ID}.ownText`]: ""
      })
    }

  }
  async _updateInput(input) {
  const id = input.id;
  const item = this.item;
  const value = input.value;

  if (input.type === "text") {
    const formula = value.trim();
    if (formula) {
        const rollValidate = Roll.validate(formula);
        input.focus();
       if(!rollValidate){
        ui.notifications.error(
          game.i18n.format(`${MODULE_ID}.invalidRollFormula`, {
            formula
          })
        );
        input.focus();
        input.style.color = "red";
        return;
      }
      else{
        input.style.color = ""
      }
    }
  }
  await item.update({
    [`flags.${MODULE_ID}.${id}`]: value
  })
}
}

function registerHandlebarsHelpers() {
  Handlebars.registerHelper({
    eq: (v1, v2) => v1 === v2,
    ne: (v1, v2) => v1 !== v2,
    lt: (v1, v2) => v1 < v2,
    gt: (v1, v2) => v1 > v2,
    lte: (v1, v2) => v1 <= v2,
    gte: (v1, v2) => v1 >= v2,
    not: (v1) => !v1,
    and() {
      return Array.prototype.every.call(arguments, Boolean);
    },
    or() {
      return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
    },
  });
  Handlebars.registerHelper("log", function (element) {
    console.log(element);
  });
}
async function enrich(html) {
  if (!html) return html;
  return await foundry.applications.ux.TextEditor.implementation.enrichHTML(
    html,
    {
      secrets: game.user.isOwner,
      async: true,
    },
  );
}