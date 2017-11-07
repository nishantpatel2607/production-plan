import {  PipeTransform, Pipe } from '@angular/core';
import { IMachine } from '../../model/machine';

@Pipe({
    name: 'machineFilter'
})
export class MachineFilterPipe implements PipeTransform {

    transform(value: IMachine[], filterBy: string): IMachine[] {
        filterBy = filterBy ? filterBy.toLocaleLowerCase() : null;
        return filterBy ? value.filter((machine: IMachine) =>
            machine.machineSrNo.toLocaleLowerCase().indexOf(filterBy) !== -1) : value;
    }
}
