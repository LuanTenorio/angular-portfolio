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
  selectedFile?: File

  constructor(
    private readonly fb: FormBuilder,
    private readonly skillsService: SkillsService
  ){
    this.form = fb.group({
      name: ['asdljkasdk', Validators.required],
      description: ['lksjakldjzxmn', Validators.required],
      link: ['asdkljaslkjczxlkjalskdj']
    })
  }

  changeImage(event: any){
    this.selectedFile = event.target.files[0]
  }

  save(){
    if(this.form.valid && this.selectedFile !== undefined){
      const reader = new FileReader();

      reader.readAsDataURL(this.selectedFile);

      reader.onload = () => {
        const base64String = reader.result?.toString()

        if(base64String){
          const formData: CreateSkillDto = {
            pathImage: base64String,
            name: this.form.value['name'],
            description: this.form.value['description'],
            link:  this.form.value['link']
          }

          this.skillsService.addSkill(formData).subscribe(
            ({skill}) => {
              console.log(skill);
            }
          )
        }
      }

      console.log('valid');
    }else{
      console.log('invalid');

    }
  }

}
