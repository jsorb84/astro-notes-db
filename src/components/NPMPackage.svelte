<script lang="ts">
	import type { NPMPackage } from "../consts";
	export let pack: NPMPackage;
</script>

<div class="border w-[350px] h-[185px] p-3 rounded container">
	<span class="text-lg font-bold">{pack.name}</span>
	<div class="py-5">
		<a
			href="{pack.docsurl}"
			target="_blank"
			class="btn">Documentation</a
		>
	</div>
	<div class="foot">
		<a href="#">
			<img
				alt="VersionBadge"
				src="{`https://img.shields.io/badge/${`Version`}-${
					pack.version
				}-red?style=for-the-badge`}"
			/>
		</a>
		<a
			href="{pack.npmurl}"
			target="_blank"
		>
			<img
				alt="NPMBadge"
				src="{`https://img.shields.io/npm/dw/${pack.name}?style=for-the-badge&logo=npm&color=red}`}"
			/>
		</a>
	</div>
</div>

<style lang="postcss">
	.btn {
		@apply border p-2 rounded-xl;
	}
	.btn:any-link {
		@apply text-white;
	}
	.foot {
		@apply flex-row flex mt-auto gap-2;
	}
</style>
