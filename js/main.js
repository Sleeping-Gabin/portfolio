gsap.registerPlugin(ScrollToPlugin, SplitText);

// window.addEventListener("load", () => {
document.fonts.ready.then(() => {
  //애니메이션
  const sections = document.querySelectorAll(".section-outer");
  const timelines = [];
  let currentIdx = 0;

  const stickerAni = {
    from: {
      x: "randome (-5, 5)",
      y: "randome (-20, -10)",
      scale: 1.2,
      opacity: 0,
    },
    to: {
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      duration: 0.4,
      stagger: 0.3
    }
  };
  
  //intro
  const introSplit = SplitText.create(
    ".intro-section .title", {
    type: "chars",
    tag: "span"
  });

  let introTl = gsap.timeline({
    paused: true,
  })
  .fromTo(introSplit.chars, {
    y: -20,
    opacity: 0,
  }, {
    y: 0,
    opacity: 1,
    stagger: 0.1,
  })
  .fromTo(".intro-section-outer .sticker",
    stickerAni.from, stickerAni.to, "+=0.2"
  );

  timelines.push(introTl);

  //profile
  let profileTl = gsap.timeline({
    paused: true,
  })
  .fromTo(".profile-section .profile", {
    x: -200,
    opacity: 0
  }, {
    x: 0,
    opacity: 1
  })
  .fromTo(".profile-section .info-box", {
    y: 100,
    opacity: 0
  }, {
    y: 0,
    opacity: 1,
    stagger: 0.3
  }, "0")
  .fromTo(".profile-section .sticker:not(.fix)",
    stickerAni.from, stickerAni.to, "+=0.2"
  );

  timelines.push(profileTl);

  //skill
  let skillTl = gsap.timeline({
    paused: true,
  })
  .fromTo(".skill-section-outer .section-title", {
    x: -30,
    opacity: 0
  }, {
    x: 0,
    opacity: 1
  })
  .fromTo(".skill-section .skill-title", {
    x: -30,
    opacity: 0
  }, {
    x: 0,
    opacity: 1
  })
  .add("skill")

  document.querySelectorAll(".skill-section .skills").forEach(skills => {
    const skill = skills.querySelectorAll(".skill");
    skillTl.fromTo(skill, {
      y: 10,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      stagger: 0.2
    }, "skill");
  });

  skillTl.fromTo(".skill-section .sticker:not(.fix)",
    stickerAni.from, stickerAni.to, "+=0.2"
  );

  timelines.push(skillTl);

  //project
  let projectTl = gsap.timeline({
    paused: true,
  })
  .fromTo(".project-section-outer .section-title", {
    x: -30,
    opacity: 0
  }, {
    x: 0,
    opacity: 1
  })
  .fromTo(".project-section .thumbnail", {
    x: -50,
    opacity: 0
  }, {
    x: 0,
    opacity: 1,
    stagger: 0.2
  })
  .fromTo(".project-section .sticker",
    stickerAni.from, stickerAni.to, "+=0.2"
  );

  timelines.push(projectTl);

  //contact
  let contactSplit = SplitText.create(
    ".contact-section .thanks p", {
    type: "chars",
    tag: "span"
  });

  let contactTl = gsap.timeline({
    paused: true,
  })
  .fromTo(contactSplit.chars, {
    y: -20,
    opacity: 0,
  }, {
    y: 0,
    opacity: 1,
    stagger: 0.1,
  })
  .fromTo(".contact-section .thanks .exclamation", {
    y: -10,
    opacity: 0
  }, {
    y: 0,
    opacity: 1,
  })
  .fromTo(".contact-section .contact", {
    y: 100,
    opacity: 0
  }, {
    y: 0,
    opacity: 1
  })
  .fromTo(".contact-section .sticker:not(.exclamation)",
    stickerAni.from, stickerAni.to, "+=0.2"
  );

  timelines.push(contactTl);

  //시작
  setCurrentSection();
  window.addEventListener("resize", setCurrentSection);

  //스크롤 시 애니메이션
  sections.forEach((section, idx) => {
    section.addEventListener("wheel", (e) => {
      e.preventDefault();

      let nextIdx = e.deltaY > 0 ? idx + 1 : idx - 1;
      if (nextIdx >= 0 && nextIdx < sections.length) {
        gsap.to(window, {
          duration: 0.5,
          scrollTo: "#" + sections[nextIdx].id,
          onComplete: () => {
            moveSection(idx, nextIdx);
          }
        });
      }
    }, {passive: false});
  });

  //스티커 애니메이션
  const stickers = document.querySelectorAll(".sticker:not(.fix)");
  stickers.forEach(sticker => {
    let rotateZ = sticker.style.transform;
    rotateZ = rotateZ.match(/rotate\((-?\d|.+)deg\)/);
    rotateZ = rotateZ ? Math.round(rotateZ[1]) : 0;

    let ani = gsap.to(sticker,{
      rotation: rotateZ+360,
      duration: 0.8,
      paused: true,
    });

    sticker.addEventListener("mouseenter", () => {
      if (!ani.isActive())
        ani.restart();
    });
  });

  positionSkillTxt();
  window.addEventListener("resize", positionSkillTxt);

  //swiper
  let windowWidth = window.innerWidth;
  let space = windowWidth <= 1280 ? (windowWidth - 20 * 13) / 12 * 2 : 85 * 2 + windowWidth - 1240;

  let swiper = new Swiper(".swiper", {
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    allowTouchMove: false,
    loop: true,
    spaceBetween: space,
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1280) {
      swiper.params.spaceBetween = 85 * 2 + window.innerWidth - 1240;
      swiper.update();
    }
  });

  //프로젝트 모달
  const thumbnails = document.querySelectorAll(".thumbnail");
  const modal = document.querySelector(".project-modal");

  thumbnails.forEach((thumbnail, idx) => {
    thumbnail.addEventListener("click", () => {
      modal.classList.remove("hidden");
      swiper.slideToLoop(idx, 0);

      gsap.fromTo(".project-modal .sticker:not(.fix)", 
        stickerAni.from, stickerAni.to
      );
    });
  });

  const closeBtn = modal.querySelector(".close-btn");
  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  modal.addEventListener("wheel", (e) => {
    const project = swiper.slides[swiper.activeIndex];
    const projectTxt = project.querySelector(".project-txt");
    
    let scrollable = e.target === projectTxt;
    scrollable &&= projectTxt.scrollHeight > projectTxt.clientHeight;
    scrollable &&= (e.deltaY < 0 && projectTxt.scrollTop > 0) || (e.deltaY > 0 && projectTxt.scrollHeight - projectTxt.scrollTop - 1 > projectTxt.clientHeight);
    console.log(projectTxt.scrollTop, projectTxt.scrollHeight - projectTxt.scrollTop, projectTxt.clientHeight)

    if (!scrollable) {
      e.preventDefault();
    }
  }, {passive: false});

  modal.addEventListener("click", (e) => {
    const frame = modal.querySelector(".modal-frame");
    const distance = Math.abs(e.clientX - (window.innerWidth / 2)) - 640;

    if (e.target === modal || e.target === frame || distance > 0) {
      modal.classList.add("hidden");
    }
  });
  
  //네비게이션  
  const nav = document.querySelector(".nav");
  const links = nav.querySelectorAll(".link");

  nav.addEventListener("wheel", (e) => e.preventDefault(), {passive: false});

  links.forEach((link, idx) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      gsap.to(window, {
        scrollTo: link.hash,
        onComplete: () => moveSection(currentIdx, idx),
      });
    });
  });

  //현재 섹션 재지정
  function setCurrentSection() {  
    const links = document.querySelectorAll(".nav .link");
    const modal = document.querySelector(".project-modal");    

    let prevIdx = currentIdx;
    currentIdx = Math.round(window.scrollY / window.innerHeight);

    gsap.to(window, {
      scrollTo: "#" + sections[currentIdx].id,
      onStart: () => {
        links.forEach(link => link.classList.remove("active"));
        links[currentIdx].classList.add("active");
      },
      onComplete: () => {
        if (prevIdx !== currentIdx) {
          timelines[prevIdx].revert();
        }

        if (currentIdx===3 && !modal.classList.contains("hidden")) {
          gsap.fromTo(".project-modal .sticker:not(.fix)", 
            stickerAni.from, stickerAni.to
          );
        }
        else {
          timelines[currentIdx].restart();
        }
      }
    });
  }
  
  //섹션 변경
  function moveSection(fromIdx, toIdx) {
    const links = document.querySelectorAll(".nav .link");

    if (fromIdx === toIdx) return;

    links.forEach(link => link.classList.remove("active"));
    links[toIdx].classList.add("active");

    timelines[fromIdx].revert();
    timelines[toIdx].restart();
    currentIdx = toIdx;
  }

  //삐져나간 스킬 설명 위치 재설정
  function positionSkillTxt() {
    const skills = document.querySelectorAll(".skill-section .skill:has(.skill-txt)");

    skills.forEach(skill => {
      const txt = skill.querySelector(".skill-txt");
      txt.style.visibility = "hidden";
      txt.style.display = "block";
      
      let bound = txt.getBoundingClientRect();
      let left = -1 * bound.width / 2 + skill.clientWidth / 2;
      txt.style.left = left + "px";
  
      bound = txt.getBoundingClientRect();
      if (bound.right > window.innerWidth) {
        txt.style.left = (left + window.innerWidth - bound.right - 80) + "px";
      }
      else if (bound.left < 0) {
        txt.style.left = (left - bound.left + 20) + "px";
      }
  
      txt.style.display = "";
      txt.style.visibility = "visible";
    });
  }
})
