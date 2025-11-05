const urls=['http://localhost:5000/','http://localhost:5000/assets/index-Cez70DlB.css','http://localhost:5000/some/nested/route'];
(async ()=>{
  for (const u of urls){
    try{
      const r = await fetch(u);
      console.log(`${u} -> ${r.status}`);
    } catch(e){
      console.log(`${u} -> ERROR: ${e.message}`);
    }
  }
})();
