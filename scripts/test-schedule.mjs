import assert from 'node:assert/strict';
import {validateSchedule,time} from '../dist/schedule-model.mjs';
const base=()=>({schemaVersion:1,revision:1,updatedAt:'2026-10-18T06:40:00Z',settings:{days:[7,3],start:540,end:1230},courses:[{id:'a',title:'測試課程',day:7,start:540,duration:90,color:'teal',courseKey:'essential'}]});
assert.equal(validateSchedule(base()).courses.length,1);
for(const key of ['students','enrollments','note','capacity']){const d=base();d.courses[0][key]=[];assert.throws(()=>validateSchedule(d));}
for(const mutate of [d=>d.revision=-1,d=>d.settings.days=[3,3],d=>d.courses[0].duration=900,d=>d.courses[0].day=1,d=>d.updatedAt='not a date',d=>d.courses.push({...d.courses[0]})]){const d=base();mutate(d);assert.throws(()=>validateSchedule(d));}
for(const key of ['open-class','']){const d=base();d.courses[0].courseKey=key;assert.equal(validateSchedule(d).courses[0].courseKey,key);}
const d=base();d.courses.push({...d.courses[0],id:'b'});assert.equal(validateSchedule(d).courses.length,2);
assert.equal(time(1230),'20:30');console.log('Schedule contract checks passed (privacy, categories, time bounds, overlapping classes).');
