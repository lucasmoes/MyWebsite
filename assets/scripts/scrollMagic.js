var controller = new ScrollMagic.Controller();

var aboutScene = new ScrollMagic.Scene({
    triggerElement: '.about',
    triggerHook: 0.8,
})
    .setClassToggle('.about', 'show')
    .addTo(controller);


var skillsScene = new ScrollMagic.Scene({
    triggerElement: '.skills',
    triggerHook: 0.8,
})
    .setClassToggle('.skills', 'show')
    .addTo(controller);

var timelineScene = new ScrollMagic.Scene({
    triggerElement: '.tline',
    triggerHook: 0.8,
})
    .setClassToggle('.tline', 'show')
    .addTo(controller);