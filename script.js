// Small helper: works on NodeLists/arrays everywhere, no reliance on NodeList.forEach
function each(list, fn){
  for(var i = 0; i < list.length; i++){ fn(list[i], i); }
}

// ===== Theme toggle (light/dark) =====
(function(){
  var btn = document.getElementById('themeToggle');
  if(!btn) return;

  btn.addEventListener('click', function(){
    var current = document.documentElement.getAttribute('data-theme') || 'dark';
    var next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    try{ localStorage.setItem('theme', next); }catch(e){}
  });
})();

// ===== Mobile nav toggle =====
(function(){
  var toggle = document.querySelector('.menu-toggle');
  var navGroup = document.querySelector('.nav-group');
  if(!toggle || !navGroup) return;

  function closeMenu(){
    toggle.classList.remove('open');
    navGroup.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', function(){
    var isOpen = navGroup.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu after choosing a link, or on resize back to desktop
  each(navGroup.querySelectorAll('a'), function(link){
    link.addEventListener('click', closeMenu);
  });
  window.addEventListener('resize', function(){
    if(window.innerWidth > 760) closeMenu();
  });
})();

// ===== Back to top button =====
(function(){
  var btn = document.getElementById('toTop');
  if(!btn) return;
  window.addEventListener('scroll', function(){
    btn.classList.toggle('show', window.scrollY > 500);
  });
  btn.addEventListener('click', function(){
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ===== Scroll reveal =====
(function(){
  var selector = '.service-card, .project-card, .project-card-big, .service-card-big, ' +
                 '.process-step, .timeline-item, .skill-row, .info-card, .form-card, .section-head';
  var targets = document.querySelectorAll(selector);
  if(!targets.length) return;

  if(!('IntersectionObserver' in window)){
    each(targets, function(el){ el.classList.add('reveal', 'in-view'); });
    return;
  }

  each(targets, function(el){ el.classList.add('reveal'); });

  var observer = new IntersectionObserver(function(entries){
    each(entries, function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  each(targets, function(el){ observer.observe(el); });
})();

// ===== Contact form (no backend — validates, then opens a pre-filled email) =====
(function(){
  var form = document.getElementById('contactForm');
  if(!form) return;
  var note = document.getElementById('formNote');

  form.addEventListener('submit', function(e){
    e.preventDefault();

    var name = document.getElementById('cf-name');
    var email = document.getElementById('cf-email');
    var subject = document.getElementById('cf-subject');
    var message = document.getElementById('cf-message');
    var fields = [name, email, subject, message];
    var firstInvalid = null;

    each(fields, function(input){
      var wrap = input.parentElement;
      var valid = input.checkValidity() && input.value.trim() !== '';
      wrap.classList.toggle('invalid', !valid);
      if(!valid && !firstInvalid) firstInvalid = input;
    });

    if(firstInvalid){
      note.textContent = 'Please fill in all fields with a valid email before sending.';
      note.className = 'form-note error';
      firstInvalid.focus();
      return;
    }

    var body = message.value.trim() + '\n\n— ' + name.value.trim() + ' (' + email.value.trim() + ')';
    var mailto = 'mailto:jmg.fajardo.26@gmail.com' +
      '?subject=' + encodeURIComponent(subject.value.trim()) +
      '&body=' + encodeURIComponent(body);

    window.location.href = mailto;
    note.textContent = 'Opening your email app to send this message...';
    note.className = 'form-note success';
  });

  // Clear the invalid state as soon as the person starts fixing a field
  each(form.querySelectorAll('input, textarea'), function(input){
    input.addEventListener('input', function(){
      input.parentElement.classList.remove('invalid');
    });
  });
})();

// ===== Portfolio filter =====
(function(){
  var filterRow = document.getElementById('filterRow');
  if(!filterRow) return;
  var buttons = filterRow.querySelectorAll('[data-filter]');
  var cards = document.querySelectorAll('.project-card-big[data-category]');
  var emptyNote = document.getElementById('filterEmpty');

  each(buttons, function(btn){
    btn.addEventListener('click', function(){
      each(buttons, function(b){ b.classList.remove('active'); });
      btn.classList.add('active');

      var filter = btn.getAttribute('data-filter');
      var visibleCount = 0;

      each(cards, function(card){
        var match = filter === 'all' || card.getAttribute('data-category') === filter;
        card.classList.toggle('hidden', !match);
        if(match) visibleCount++;
      });

      if(emptyNote) emptyNote.style.display = visibleCount === 0 ? 'block' : 'none';
    });
  });
})();

// ===== Copy email to clipboard =====
(function(){
  var links = document.querySelectorAll('.copy-email');
  if(!links.length) return;

  each(links, function(link){
    link.addEventListener('click', function(e){
      e.preventDefault();
      var email = link.getAttribute('data-email');

      function showCopied(){
        link.classList.add('copied');
        setTimeout(function(){ link.classList.remove('copied'); }, 1600);
      }

      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(email).then(showCopied).catch(function(){
          window.location.href = 'mailto:' + email;
        });
      } else {
        window.location.href = 'mailto:' + email;
      }
    });
  });
})();
