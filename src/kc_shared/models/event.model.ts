/**
 Copyright 2022 Rob Royce

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
import {UuidModel} from "./uuid.model";

export type EventType = 'create' | 'read' | 'update' | 'delete' | 'reminder' | 'checkPoint' | 'dueDate';

export interface EventModel {
    timestamp: string;
    id: UuidModel;
    type: EventType;
    description?: string;
    icon?: string;
}

export interface KcCalendar {
    events: EventModel[];
    end: Date | string | null;
    start: Date | string | null;
}