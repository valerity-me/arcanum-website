// The twelve archetypes, word for word from the app:
// tarot_app/assets/translations/en.json, key "archetype". Generated, do not
// retype: if the app texts change, regenerate this file from that source.
// Pictures: public/archetypes/<key>.webp (scripts/prepare-archetypes.py).

export type Archetype = {
  key: string;
  name: string;
  motto: string;
  /** Strength, then "The flip side: ...". Kept whole; the page splits it at the marker. */
  about: string;
};

export const archetypes: Archetype[] = [
  {
    key: "innocent",
    name: "The Innocent",
    motto: "Trust begins without guarantees.",
    about: "You trust people and expect good things. Being around you feels simpler and calmer. The flip side: you notice unpleasant truths later than others.",
  },
  {
    key: "everyman",
    name: "The Everyman",
    motto: "You can be yourself among your own.",
    about: "You want to belong and be on equal terms. You find common ground easily and don't pretend to be more than you are. The flip side: your own view sometimes gives way to the majority's.",
  },
  {
    key: "hero",
    name: "The Hero",
    motto: "Hard things yield to the persistent.",
    about: "You go where it's difficult and see it through. People can rely on you after others have given up. The flip side: rest feels like weakness.",
  },
  {
    key: "caregiver",
    name: "The Caregiver",
    motto: "Help before advice.",
    about: "You see who needs help and don't walk past. People feel safe with you. The flip side: there's often nothing left for yourself.",
  },
  {
    key: "explorer",
    name: "The Explorer",
    motto: "Freedom is worth more than comfort.",
    about: "You need to know what's past the edge. New things wake you up and routine wears you down. The flip side: leaving can be easier than staying to finish.",
  },
  {
    key: "outlaw",
    name: "The Outlaw",
    motto: "Authority doesn't make you right.",
    about: "You won't go along with what you think is unfair, and you say so out loud. The flip side: the argument sometimes matters more than the result.",
  },
  {
    key: "lover",
    name: "The Lover",
    motto: "Closeness takes two.",
    about: "You value closeness, beauty and everything that makes life warm. You attach deeply. The flip side: someone's coldness can throw you off for a long time.",
  },
  {
    key: "creator",
    name: "The Creator",
    motto: "Nothing new comes from copying.",
    about: "You need to make your own thing, your own way. Ready-made answers don't satisfy you. The flip side: the bar is so high that finishing is hard.",
  },
  {
    key: "jester",
    name: "The Jester",
    motto: "Being serious doesn't make you wise.",
    about: "You can defuse any room and you live in the moment. You're easy to be around. The flip side: heavy conversations make you reach for a joke.",
  },
  {
    key: "sage",
    name: "The Sage",
    motto: "Understand first, then act.",
    about: "You need to work out how things really are. You think deeper and longer than most. The flip side: thinking sometimes replaces doing.",
  },
  {
    key: "magician",
    name: "The Magician",
    motto: "One change leads to another.",
    about: "You notice links others miss and believe life can be changed. The flip side: you want fast transformation where time is needed.",
  },
  {
    key: "ruler",
    name: "The Ruler",
    motto: "To lead is to own the consequences.",
    about: "You take responsibility and bring order where there is none. People follow you. The flip side: letting go of control and trusting is hard.",
  },
];
