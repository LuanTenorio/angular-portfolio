import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SkillsService } from '../skills.service';
import { CreateSkillDto } from '../dto/create-skill.dto';

@Component({
  selector: 'app-add-skill',
  templateUrl: './add-skill.component.html',
  styleUrls: ['./add-skill.component.scss']
})
export class AddSkillComponent {

  form: FormGroup

  constructor(
    private readonly fb: FormBuilder,
    private readonly skillsService: SkillsService
  ){
    this.form = fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      pathImage: ['', Validators.required],
      link: ['']
    })
  }

  save(){
    if(this.form.valid){
      console.log('valid');
      this.skillsService.addSkill(this.form.value).subscribe(
        ({skill}) => {
          console.log(skill);
        }
      )
    }else{
      console.log('invalid');

    }
  }

}
