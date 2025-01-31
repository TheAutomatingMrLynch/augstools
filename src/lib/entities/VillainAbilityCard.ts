import { VillainAbilityCardIconsEnum } from "$lib/enums/Enums"
import { ThemeTemplatesEnum } from "$lib/interfaces/templates/ThemeTemplatesEnum"
import { Type } from "class-transformer"
import { Column, ChildEntity, ManyToOne, OneToOne, JoinColumn, AfterLoad } from "typeorm"
import { CompetitiveVillain } from "./CompetitiveVillain"
import { Homebrew } from "./Homebrew"
import { Image } from "./Image"
import { User } from "./User"

@ChildEntity()
export class VillainAbilityCard extends Homebrew {
    constructor(userId?: string) {
        super();

        if (userId && userId.length > 0) {
            this.user = new User();
            this.user.id = userId;
        }
        this.image = new Image();
    }

    @Type(() => Image)
    @OneToOne(type => Image, { eager: true, cascade: true })
    @JoinColumn()
    image: Image

    @Column("varchar")
    effect: string

    @Column("varchar")
    backgroundColor: string
    
    @Column({
        type: "enum",
        enum: ThemeTemplatesEnum
    })
    theme: ThemeTemplatesEnum

    @Column({
        type: "enum",
        enum: VillainAbilityCardIconsEnum,
        array: true
    })
    iconCost: VillainAbilityCardIconsEnum[]
    
    @Type(() => CompetitiveVillain)
    @ManyToOne(type => CompetitiveVillain, villain => villain.abilityCards, { nullable: true })
    villain: CompetitiveVillain | undefined

    public isValid(): boolean {
        if (!this.name || !this.effect || this.name.length == 0 || this.effect.length == 0 
            || !this.image || this.image.url?.length == 0) {
            return false;
        }

        return true;
    }

    public validityErrors(): string {
        if (this.isValid()) {
            return '';
        }

        const errors = [];

        if (!this.name || this.name.length === 0) {
            errors.push('Card Name');
        }
        if (!this.effect || this.effect.length === 0) {
            errors.push('Effect');
        }
        if (!this.image || this.image.url?.length === 0) {
            errors.push('Image')
        }
        
        return errors.join(', ');
    }
}