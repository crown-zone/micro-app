import {reroute} from "./navigation/reroute";

export let started = false;

export function start() {
    started = true;
    // 启动应用
    reroute();
}
