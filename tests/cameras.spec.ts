import { test, expect } from '@playwright/test';

async function setup(page: any) {
  await page.goto('/');
  await page.evaluate(() => {
    class CameraStub extends HTMLElement {
      hass: any;
      config: any;
      setConfig(config: any) { this.config = config; }
      connectedCallback() { this.textContent = this.config.view.default; }
    }
    customElements.define('advanced-camera-card', CameraStub);
    const card = document.querySelector('signal-home') as any;
    card.setConfig({ ...card.config, cameras: ['camera.front_door', 'camera.garden'] });
  });
  await page.getByRole('button', { name: 'Cameras', exact: true }).click();
}

test('live stays stable beside a simple event grid and releases on navigation', async ({ page }) => {
  await setup(page);
  const live=page.getByRole('region',{name:'Live camera'}).locator('advanced-camera-card');
  await expect(live).toHaveText('live');
  await expect(page.locator('signal-camera-grid')).toHaveCount(1);
  await expect(page.locator('advanced-camera-card')).toHaveCount(1);
  const config=await live.evaluate((e:any)=>e.config);
  expect(config.live.controls.next_previous.style).toBe('none');
  expect(config.live.controls.timeline.mode).toBe('none');
  expect(config.cameras[0].go2rtc.stream).toBe('front_door');
  expect(config.cameras).toHaveLength(1);
  expect(config.cameras[0].capabilities.force).toEqual(['2-way-audio']);
  expect(config.menu.buttons.call.enabled).toBe(false);
  expect(config.menu.buttons.microphone.enabled).toBe(false);
  expect(config.live.controls.call).toEqual({enabled:false,lock:false});
  expect(config.live.microphone.auto_unmute).toEqual([]);
  expect(config.live.auto_unmute).toEqual(['call']);
  expect(config.live.auto_mute).toContain('call');
  const controls=page.getByRole('group',{name:'Doorbell voice controls'});
  await expect(controls.getByRole('button',{name:'Start voice'})).toBeVisible();
  await expect(controls.getByRole('button',{name:'Hold to talk'})).toBeDisabled();
  await page.evaluate(()=>{(window as any).cameraActions=[];document.addEventListener('ll-custom',(event:any)=>(window as any).cameraActions.push(event.detail));});
  await controls.getByRole('button',{name:'Start voice'}).click();
  await expect(controls.getByRole('button',{name:'End voice'})).toBeVisible();
  const push=controls.getByRole('button',{name:'Hold to talk'});
  await expect(push).toBeEnabled();
  await push.dispatchEvent('pointerdown',{pointerId:1});
  const speaking=controls.getByRole('button',{name:'Speaking…'});
  await expect(speaking).toBeVisible();
  await speaking.dispatchEvent('pointerup',{pointerId:1});
  const actions=()=>page.evaluate(()=>(window as any).cameraActions.map((action:any)=>action.advanced_camera_card_action));
  // Half-duplex: the doorbell stays muted while talking and through its echo tail.
  expect(await actions()).toEqual(['call_start','mute','microphone_unmute','microphone_mute']);
  await expect.poll(actions).toEqual(['call_start','mute','microphone_unmute','microphone_mute','unmute']);
  await push.dispatchEvent('pointerdown',{pointerId:2});
  await speaking.dispatchEvent('pointerup',{pointerId:2});
  await controls.getByRole('button',{name:'End voice'}).click();
  await page.waitForTimeout(2200);
  expect((await actions()).slice(5)).toEqual(['mute','microphone_unmute','microphone_mute','call_end']);
  await expect(page.getByRole('button',{name:'Playback',exact:true})).toHaveCount(0);
  await live.evaluate((e:any)=>e.dataset.preserved='yes');
  await page.evaluate(()=>(window as any).demo.setClimate({temperature:73}));
  await expect(live).toHaveAttribute('data-preserved','yes');
  await page.getByRole('combobox',{name:'Camera',exact:true}).selectOption('camera.garden');
  expect(await page.getByRole('region',{name:'Live camera'}).locator('advanced-camera-card').evaluate((e:any)=>e.config.menu.buttons.call.enabled)).toBe(false);
  expect(await page.locator('signal-camera-grid').evaluate((e:any)=>e.camera)).toBe('garden');
  await page.getByRole('navigation',{name:'Dashboard navigation'}).getByRole('button',{name:'Home'}).click();
  await expect(page.locator('advanced-camera-card')).toHaveCount(0);
  await expect(page.locator('signal-camera-grid')).toHaveCount(0);
});

test('event grid opens the selected recording on a phone without timeline controls',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await eventSetup(page);
  await page.getByRole('button',{name:'Back to live & events'}).click();
  const tiles=page.locator('signal-camera-grid .tile');
  await expect(tiles).toHaveCount(2);
  expect(await page.locator('signal-camera-grid .grid').evaluate(e=>getComputedStyle(e).gridTemplateColumns.split(' ').length)).toBe(2);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);
  await tiles.nth(1).click();
  await expect(page.locator('signal-camera-event ha-hls-player')).toHaveCount(1);
  expect(page.url()).toContain('signal_review=1790884969.324281-vuiwnb');
  await expect(page.locator('advanced-camera-card')).toHaveCount(0);
});

test('unconfigured dashboards retain seven tabs and invalid camera IDs are rejected', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('navigation', { name: 'Dashboard navigation' }).getByRole('button')).toHaveCount(7);
  const result = await page.evaluate(() => {
    const card = document.querySelector('signal-home') as any;
    try { card.setConfig({ ...card.config, cameras: ['http://camera/stream'] }); return false; }
    catch { return true; }
  });
  expect(result).toBe(true);
});

 test('notification deep link opens autoplaying cameras and cleans up on navigation', async ({page}) => {
  await setup(page);
  await page.getByRole('navigation', {name: 'Dashboard navigation'}).getByRole('button', {name: 'Home'}).click();
  await page.evaluate(() => location.hash = '#signal/cameras');
  await expect(page.locator('advanced-camera-card')).toHaveCount(1);
  const config = await page.getByRole('region', {name: 'Live camera'}).locator('advanced-camera-card').evaluate((el: any) => el.config);
  expect(config.live.auto_play).toContain('visible');
  expect(config.live.auto_unmute).toEqual(['call']);
  expect(config.menu.buttons.call.enabled).toBe(false);
  await expect(page.getByRole('button',{name:'Start voice'})).toBeVisible();
  await page.getByRole('navigation', {name: 'Dashboard navigation'}).getByRole('button', {name: 'Home'}).click();
  await expect(page.locator('advanced-camera-card')).toHaveCount(0);
});

async function eventSetup(page: any, missing = false) {
  await setup(page);
  await page.evaluate((missing: boolean) => {
    const card = document.querySelector('signal-home') as any;
    (window as any).eventRequests = [];
    class HlsStub extends HTMLElement { url = ''; }
    customElements.define('ha-hls-player', HlsStub);
    const call = card.hass.callWS.bind(card.hass);
    card.hass.callWS = async (message: any) => {
      (window as any).eventRequests.push(message);
      if(message.type === 'frigate/reviews/get') return missing ? [] : [
        {id:'1790884975.123456-newest',camera:'front_door',data:{objects:['person'],detections:['1790884975.123456-newest']},start_time:1790884975,end_time:1790884980},
        {id:'1790884969.324281-vuiwnb',camera:'front_door',data:{objects:['person'],detections:['1790884969.324281-vuiwnb','1790884960.000000-another']},start_time:1790884969,end_time:1790884977},
      ];
      if(message.type === 'media_source/resolve_media') return {url:'/api/frigate/frigate/vod/front_door/start/1790884964/end/1790884982/index.m3u8'};
      if(message.type === 'auth/sign_path') return {path:message.path+'?authSig=test'};
      return call(message);
    };
    const url = new URL(location.href);url.searchParams.set('signal_event','1790884969.324281-vuiwnb');url.searchParams.set('signal_camera','front_door');url.searchParams.set('signal_instance','frigate');
    history.pushState({},'',url);window.dispatchEvent(new Event('location-changed'));
  }, missing);
}

test('person notification opens its exact recorded event without starting a live stream', async ({page}) => {
  await eventSetup(page);
  await expect(page.getByRole('region',{name:'Recorded event',exact:true})).toBeVisible();
  await expect(page.locator('signal-camera-event ha-hls-player')).toHaveCount(1);
  await expect(page.locator('advanced-camera-card')).toHaveCount(0);
  const requests = await page.evaluate(()=>(window as any).eventRequests);
  expect(requests.some((r:any)=>r.type==='frigate/events/get')).toBe(false);
  expect(requests.some((r:any)=>r.type==='frigate/reviews/get')).toBe(true);
  expect(requests.filter((r:any)=>r.type==='auth/sign_path' && r.path.includes('/vod/'))).toHaveLength(1);
  expect(await page.locator('ha-hls-player').evaluate((e:any)=>({url:e.url,muted:e.muted,controls:e.controls}))).toEqual({url:expect.stringContaining('/start/1790884964/end/1790884982/'),muted:true,controls:true});
  await page.locator('ha-hls-player').evaluate((e:any)=>e.dataset.preserved='yes');
  await page.evaluate(()=>{const c=document.querySelector('signal-home') as any;c.hass={...c.hass,states:{...c.hass.states}};});
  await expect(page.locator('ha-hls-player')).toHaveAttribute('data-preserved','yes');
  await page.getByRole('button',{name:'Back to live & events',exact:true}).click();
  await expect(page.getByRole('region',{name:'Live camera'})).toBeVisible();
  await expect(page.locator('signal-camera-event')).toHaveCount(0);
  expect(page.url()).not.toContain('signal_event');
  await page.goBack();
  await expect(page.locator('signal-camera-event ha-hls-player')).toHaveCount(1);
});

test('expired event has a clear recovery path and never substitutes another clip or live view',async({page})=>{
  await eventSetup(page,true);
  await expect(page.getByRole('alert')).toContainText('no longer available');
  await expect(page.locator('ha-hls-player')).toHaveCount(0);
  await expect(page.locator('advanced-camera-card')).toHaveCount(0);
  await page.getByRole('button',{name:'Back to live & events'}).click();
  await expect(page.getByRole('region',{name:'Camera history'})).toBeVisible();
  await expect(page.getByRole('region',{name:'Live camera'})).toHaveCount(1);
});

test('event screen fits phone widths and releases playback when leaving Cameras',async({page})=>{
  await page.setViewportSize({width:375,height:812});await eventSetup(page);
  await expect(page.locator('ha-hls-player')).toHaveCount(1);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);
  const dock=page.getByRole('navigation',{name:'Mobile navigation'});
  await dock.getByRole('button',{name:'Home'}).click();
  await expect(page.locator('ha-hls-player')).toHaveCount(0);
  expect(page.url()).not.toContain('signal_event');
  await dock.getByRole('button',{name:'Cameras'}).click();
  await expect(page.getByRole('region',{name:'Live camera'})).toBeVisible();
});

test('malformed notification event ID is rejected without a media request',async({page})=>{
  await eventSetup(page);
  await page.evaluate(()=>{(window as any).eventRequests=[];const u=new URL(location.href);u.searchParams.set('signal_event','../../other');history.pushState({},'',u);window.dispatchEvent(new Event('location-changed'));});
  await expect(page.getByRole('alert')).toContainText('isn’t valid');
  expect(await page.evaluate(()=>(window as any).eventRequests)).toEqual([]);
});

 test('one card per Frigate review and exact finite 5/5 playback boundaries',async({page})=>{
  await eventSetup(page);
  await page.evaluate(()=>{
    const c=document.querySelector('signal-home') as any;
    const old=c.hass.callWS;
    c.hass.callWS=async(message:any)=>message.type==='frigate/reviews/get' ? [{id:'1790899603.134638-eizc84',camera:'front_door',start_time:1790899603.134638,end_time:1790899654.134638,data:{objects:['person','doorbell: Doorbell press'],detections:['a','b','c']}}] : old(message);
  });
  await page.getByRole('button',{name:'Back to live & events'}).click();
  await expect(page.locator('signal-camera-grid .tile')).toHaveCount(1);
  await expect(page.locator('signal-camera-grid')).toContainText('51s');
  await page.locator('signal-camera-grid .tile').click();
  await expect(page.locator('ha-hls-player')).toHaveCount(1);
  expect(await page.locator('ha-hls-player').evaluate((e:any)=>e.url)).toContain('/start/1790899598/end/1790899659/');
  await expect(page.getByRole('region',{name:'Recorded event',exact:true})).toContainText('51-second visit');
  await expect(page.locator('advanced-camera-card')).toHaveCount(0);
  await page.getByRole('button',{name:'Back to live & events'}).click();
  await expect(page.getByRole('region',{name:'Live camera'})).toBeVisible();
  await expect(page.locator('signal-camera-grid .tile')).toHaveCount(1);
});

test('alarm-only camera stays off and unconnected until the alarm is armed', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    class CameraStub extends HTMLElement {
      hass: any;
      config: any;
      setConfig(config: any) { this.config = config; }
      connectedCallback() { this.textContent = this.config.view.default; }
    }
    customElements.define('advanced-camera-card', CameraStub);
    (window as any).demo.setState('alarm_control_panel.alarmo', 'disarmed');
    const card = document.querySelector('signal-home') as any;
    card.setConfig({ ...card.config, cameras: ['camera.front_door', 'camera.living_room'], alarm_cameras: ['camera.living_room'], alarm_entity: 'alarm_control_panel.alarmo' });
  });
  await page.getByRole('button', { name: 'Cameras', exact: true }).click();
  const live = page.getByRole('region', { name: 'Live camera' });
  // The doorbell is not alarm-only, so it stays live while disarmed.
  await expect(live.locator('advanced-camera-card')).toHaveCount(1);
  await page.getByRole('combobox', { name: 'Camera', exact: true }).selectOption('camera.living_room');
  await expect(live.getByRole('status')).toContainText('Off while you’re home');
  await expect(live.locator('.live-label')).toHaveText('Off');
  await expect(page.locator('advanced-camera-card')).toHaveCount(0);
  // Footage recorded while armed stays browsable.
  expect(await page.locator('signal-camera-grid').evaluate((e: any) => e.camera)).toBe('living_room');
  // Away's exit countdown still counts as home.
  await page.evaluate(() => (window as any).demo.setState('alarm_control_panel.alarmo', 'arming'));
  await expect(page.locator('advanced-camera-card')).toHaveCount(0);
  await page.evaluate(() => (window as any).demo.setState('alarm_control_panel.alarmo', 'armed_night'));
  await expect(live.locator('advanced-camera-card')).toHaveCount(1);
  const config = await live.locator('advanced-camera-card').evaluate((e: any) => e.config);
  expect(config.cameras[0].camera_entity).toBe('camera.living_room');
  expect(config.cameras[0].go2rtc.stream).toBeUndefined();
  expect(config.cameras[0].capabilities).toBeUndefined();
  await expect(live.locator('.live-label')).not.toHaveText('Off');
  await page.evaluate(() => (window as any).demo.setState('alarm_control_panel.alarmo', 'disarmed'));
  await expect(page.locator('advanced-camera-card')).toHaveCount(0);
  await expect(live.getByRole('status')).toContainText('Off while you’re home');
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
});
