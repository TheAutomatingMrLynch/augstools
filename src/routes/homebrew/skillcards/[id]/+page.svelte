<script lang="ts">
    import ComicButton from '$lib/components/ComicButton.svelte';
    import PageButtonContainer from '$lib/components/PageButtonContainer.svelte';
    import SkillCardEditor from '$lib/components/SkillCardEditor.svelte';
    import { SkillCard } from '$lib/entities/SkillCard';
    import { DataHelper } from '$lib/helpers/DataHelper';
    import { DateHelper } from '$lib/helpers/DateHelper';
    import type { PageData } from './$types';
    import { page } from '$app/stores';
    import { drawerStore } from '@skeletonlabs/skeleton';
    import * as htmlToImage from 'html-to-image';
    import download from 'downloadjs';
    import type { Options } from 'html-to-image/lib/types';
    import { ToastHelper } from '$lib/helpers/ToastHelper';

    export let data: PageData;

    $: skillCard = DataHelper.deserialize<SkillCard>(SkillCard, data.skillCardJSON);

    let skillCardScale = 1;
    let skillCardPage: HTMLElement;

    const handleDownload = async () => {
        let initialSkillCardScale = skillCardScale;

        drawerStore.open({ id: 'download', width: 'w-full' });
        const skillCardContainer = skillCardPage.querySelector('.skill-card-container') as HTMLElement;

        const skillCardPng = await getImage(skillCardContainer, { style: { borderRadius: '0px' } });
        if (!skillCardPng) {
            ToastHelper.create(`The following items could not be downloaded:<br/><br/> ${skillCard.name}<br/><br/>These items are using an image host that is not approved. Contact the designer to resolve this issue.`, "error", 0, false);
        }
        else {
            download(skillCardPng, `${skillCard.name} by ${skillCard.user.userName}-${Date.now()}.png`);
        }
        
        skillCardScale = initialSkillCardScale;
        drawerStore.close();
    }

    async function getImage(element: HTMLElement, options?: Options): Promise<string | undefined> {
        let image;
        try {            
            image = await htmlToImage.toPng(element, options);
        }
        catch (err) {
            return;
        }
        
        return image;
    }
</script>

<svelte:head>
    <title>{skillCard.name} by {skillCard.user.userName} - Skill Card - augs.tools</title>
    <meta name="description" content={skillCard.description} />
</svelte:head>

<ol class={data.breadcrumbClass}>
	<li class="crumb"><a href="/">Home</a></li>
	<li class="crumb-separator" aria-hidden>&rsaquo;</li>
	<li class="crumb"><a href="/homebrew">Homebrew</a></li>
	<li class="crumb-separator" aria-hidden>&rsaquo;</li>
	<li class="crumb"><a href="/homebrew/skillcards">Skill Cards</a></li>
	<li class="crumb-separator" aria-hidden>&rsaquo;</li>
	<li class="crumb">{skillCard.name}</li>
</ol>

<div class="skill-card-page" bind:this={skillCardPage}>    
    <PageButtonContainer>
        <div class="flex justify-center flex-wrap page-button-container gap-2">
            {#if data.session?.user.id == skillCard.user.id}
            <a href={$page.url + "/edit"} class="unstyled">
                <ComicButton icon="mdi:edit" text="Edit"></ComicButton>
            </a>
            {/if}
            <ComicButton icon="material-symbols:download-rounded" callback={handleDownload}></ComicButton>
        </div>
    </PageButtonContainer>
    <div class="flex justify-center gap-5 mt-5">
        <div class="read-only">
            <SkillCardEditor scale={skillCardScale} skillCard={skillCard}></SkillCardEditor>
        </div>
        <div class="homebrew-details-container flex flex-col sm:flex-row lg:flex-col gap-5 pb-5">                
            <div class="comic-label">
                <h1>Designer</h1>
                <p><a href="/user/{skillCard.user.id}">{skillCard.user.userName}</a></p>
            </div>
            <div class="comic-label">
                <h1>Created</h1>
                <p>{new Date(skillCard.dateCreated).toLocaleDateString()}</p>
            </div>
            {#if skillCard.dateCreated != skillCard.dateModified}
            <div class="comic-label">
                <h1>Updated</h1>
                <p>{DateHelper.timeSinceString(new Date(skillCard.dateModified), new Date())}</p>
            </div>
            {/if}
        </div>
    </div>
    {#if skillCard.description}
    <div class="flex gap-5 pb-5 justify-center">   
        <div class="comic-label max-w-7xl">
            <h1>Designer Notes</h1>
            <p>{skillCard.description}</p>
        </div>
    </div>
    {/if}
</div>