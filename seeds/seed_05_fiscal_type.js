
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('fiscal_type').del()
    .then(function () {
      // Inserts seed entries
      return knex('fiscal_type').insert([
          {id: 1, name: 'MICRO-FONCIER', description: "Ce regime est appliqué dans le cadre de revenu locatif NUE (non meublé), un abattement forfaitaire de 30% sur les revenus foncier est appliqué, au delà de 15 000 € par an, le passage en foncier réel est obligatoire. Regime soumis à la plus-value des particuliers."},
          {id: 2, name: 'FONCIER RÉEL', description: "Ce regime est appliqué dans le cadre de revenu locatif NUE (non meublé), il peut être choisis par option ou / et devient obligatoire si les revenus fonciers dépasse les 15 000 € du regime micro-foncier. Il permet de déduire vos charges réelles et certains type de travaux de vos revenus locatifs. Regime soumis à la plus-value des particuliers."},
          {id: 3, name: 'LMNP FORFAIT / MICRO-BIC', description: "LMNP (loueur meublé non professionnel), s'applique au revenus locatifs meublés, abattement forfaitaire de 50% octroyer par l'état. Si vos revenus locatifs (meublés) dépassent 23 000 € et que vos revenus locatifs (meublés) dépasse vos autres revenus, le passage est obligatoire en LMP (loueur meublé professionnel). Le regime MICRO-BIC (micro-entreprise) s'applique jusqu'à 72 600 € de recettes annuelles au-delà le passage au réel est obligatoire (LMNP RÉEL ou LMP). Regime soumis à la plus-value des particuliers."},
          {id: 4, name: 'LMNP RÉEL', description: "LMNP (loueur meublé non professionnel), s'applique au revenus locatifs meublés. Si vos revenus locatifs (meublés) dépassent 23 000 € et que vos revenus locatifs (meublés) dépasse vos autres revenus, le passage est obligatoire en LMP (loueur meublé professionnel). Ce regime permet de pratiquer des amortissements (travaux, bien etc...) et déduction des charges (assurance, intérêts etc... au maximum de 500€) sur vos revenus locatifs. Regime soumis à la plus-value des particuliers."},
          {id: 5, name: 'LMP', description: "LMP (loueur meublé professionnel), s'applique au revenus locatifs meublés. Si vos revenus locatifs (meublés) dépassent 23 000 € et que vos revenus locatifs (meublés) dépasse vos autres revenus, le passage est obligatoire en LMP (loueur meublé professionnel). Ce regime permet de pratiquer des amortissements (travaux, bien etc...) et déduction des charges (assurance, intérêts etc... au maximum de 500€) sur vos revenus locatifs. De plus les déficits créer par les charges engagées peuvent être déduites de votre revenu global sans limitation de montant. L'exonération de la taxe sur la plus-values est totale lorsque les recettes de location sont inférieures à 90 000 € hors taxes (HT) au cours des 2 années civiles précédentes et que l'activité a commencé depuis au moins 5 ans. L'exonération est partielle dans le cas où ces recettes sont comprises entre 90 000 € et 126 000 € HT."},
      ]);
    });
};
