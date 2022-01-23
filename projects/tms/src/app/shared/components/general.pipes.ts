import { Pipe, PipeTransform } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Pipe({
  name: 'deletedFilter',
  pure: false
})
export class DeletedFilter implements PipeTransform {
  transform(options: Array<FormGroup>): Array<FormGroup> {
    return options.filter((option: FormGroup) => option.controls['deleted'].value === false);
  }
}
