export const categories = {essential:'簡易樂高機器人班',prime:'樂高機器人班',scratch:'Scratch 程式班','robot-python':'樂高機器人 Python 班',python:'Python 程式班','open-class':'無課程，一人可開班','':'其他課程'};
export const time = m => `${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`;
export function validateSchedule(d) {
  const exact=(o,keys)=>o&&typeof o==='object'&&!Array.isArray(o)&&Object.keys(o).every(k=>keys.includes(k))&&keys.every(k=>Object.hasOwn(o,k));
  const int=(n,min,max)=>Number.isInteger(n)&&n>=min&&n<=max;
  if(!exact(d,['schemaVersion','revision','updatedAt','settings','courses'])||d.schemaVersion!==1||!int(d.revision,0,Number.MAX_SAFE_INTEGER)||typeof d.updatedAt!=='string'||(d.updatedAt&&!Number.isFinite(Date.parse(d.updatedAt))))throw Error('Invalid schedule');
  const s=d.settings;
  if(!exact(s,['days','start','end'])||!Array.isArray(s.days)||!s.days.length||s.days.length>7||new Set(s.days).size!==s.days.length||!s.days.every(n=>int(n,1,7))||!int(s.start,0,1439)||!int(s.end,s.start+1,1440)||!Array.isArray(d.courses)||d.courses.length>2000)throw Error('Invalid settings');
  const ids=new Set();
  for(const c of d.courses){
    if(!exact(c,['id','title','day','start','duration','color','courseKey'])||typeof c.id!=='string'||!c.id||ids.has(c.id)||typeof c.title!=='string'||!c.title.trim()||c.title.length>500||!s.days.includes(c.day)||!int(c.start,s.start,s.end-1)||!int(c.duration,1,s.end-c.start)||typeof c.color!=='string'||!Object.hasOwn(categories,c.courseKey))throw Error('Invalid course');
    ids.add(c.id);
  }
  return d;
}
