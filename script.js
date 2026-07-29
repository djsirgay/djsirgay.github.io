const projects=[
 {slug:'belarus-in-exile',title:'BELARUS IN EXILE',subtitle:'From Dictatorship to the Dancefloor',desc:'A two-hour journey through 55 Belarusian-language tracks — memory, resistance, desire and release, rebuilt for the playa.',img:'https://img.youtube.com/vi/5QEXd8XTPM0/maxresdefault.jpg',listen:'https://youtu.be/5QEXd8XTPM0'},
 {slug:'fresh-mashups',title:'FRESH MASHUPS',subtitle:'New collisions. No genre borders.',desc:'The newest DJ Sir Gay reworks — global pop, queer classics and Eastern European memory in unexpected collisions.',img:'assets/logo-square.svg',listen:'https://www.youtube.com/@NostalgAiRec'},
 {slug:'serebro-925',title:'SEREBRO — 925',subtitle:'Live Part 1',desc:'A continuous live mixtape rebuilding SEREBRO through mashups, re-edits and club transitions.',img:'https://img.youtube.com/vi/Mc3C-jRqcP8/maxresdefault.jpg',listen:'https://youtu.be/Mc3C-jRqcP8'},
 {slug:'tatu-wm',title:'t.A.T.u. — WM',subtitle:'10th Anniversary Version',desc:'A darker, cinematic continuous rework of the Waste Management universe.',img:'https://img.youtube.com/vi/0x5QZhKwQPg/maxresdefault.jpg',listen:'https://youtu.be/0x5QZhKwQPg'}
];
const fresh=[
 {label:'LATEST DROP',title:'Madonna VS Sam Smith — I Feel So Free x I Feel Love',img:'assets/logo-square.svg',url:'https://soundcloud.com/djsirgay/madonna_mashup'},
 {label:'MASHUP',title:'The Pussycat Dolls VS Justin Timberlake — Club Song x Like I Love You',img:'assets/logo-square.svg',url:'https://soundcloud.com/djsirgay'},
 {label:'YOUTUBE',title:'SEREBRO — SONG#2 (act3 MINOR) — DJ Sir Gay Version',img:'https://img.youtube.com/vi/tlzmzhLpfMI/maxresdefault.jpg',url:'https://www.youtube.com/watch?v=tlzmzhLpfMI'},
 {label:'LATEST DROP',title:'SEREBRO — 105 x Slomana — Sweet September MashUp',img:'https://img.youtube.com/vi/03EtLbz1Nfo/maxresdefault.jpg',url:'https://youtu.be/03EtLbz1Nfo'}
];
const freshRail=document.getElementById('fresh-rail');
const projectGrid=document.getElementById('project-grid');
if(freshRail){freshRail.innerHTML=fresh.map(x=>`<a class="fresh-card" href="${x.url}" target="_blank" rel="noreferrer"><img src="${x.img}" alt="" loading="lazy" decoding="async"><div><small>${x.label}</small><h3>${x.title}</h3></div></a>`).join('')}
if(projectGrid){projectGrid.innerHTML=projects.map((x,i)=>`<article class="project-card"><a class="visual" href="project.html?slug=${x.slug}"><img src="${x.img}" alt="${x.title}" loading="lazy" decoding="async"><span class="number">0${i+1}</span></a><div class="body"><h3>${x.title}</h3><h4>${x.subtitle}</h4><p>${x.desc}</p><div class="card-actions"><a href="${x.listen}" target="_blank" rel="noreferrer">Listen Now</a><a href="project.html?slug=${x.slug}">Read the Story</a><a href="#booking">Book This Concept</a></div></div></article>`).join('')}
const bookingForm=document.getElementById('booking-form');
if(bookingForm){bookingForm.addEventListener('submit',e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.currentTarget).entries());const subject=encodeURIComponent(`DJ Sir Gay booking request — ${d.date||'date TBD'}`);const body=encodeURIComponent([`Name: ${d.name}`,`Email: ${d.email}`,`Date: ${d.date||'TBD'}`,`Type: ${d.type}`,`Venue: ${d.venue||'TBD'}`,`Audience: ${d.audience||'TBD'}`,`Budget: ${d.budget||'TBD'}`,'',d.message].join('\n'));location.href=`mailto:ulyanoow@gmail.com?subject=${subject}&body=${body}`})}
const year=document.getElementById('year');if(year){year.textContent=new Date().getFullYear()}