
'use server';

/**
 * @fileOverview An AI agent that suggests personalized junk food combos based on user's past order history.
 *
 * - suggestCombo - A function that suggests a personalized junk food combo.
 * - SuggestComboInput - The input type for the suggestCombo function.
 * - SuggestComboOutput - The return type for the suggestCombo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { products } from '@/lib/data';

const SuggestComboInputSchema = z.object({
  userOrderHistory: z.array(
    z.object({
      itemName: z.string(),
      category: z.string(),
    })
  ).describe('The user order history, containing list of item names and categories.'),
  preferences: z.string().optional().describe('The user preferences.'),
});
export type SuggestComboInput = z.infer<typeof SuggestComboInputSchema>;

const SuggestComboOutputSchema = z.object({
  comboSuggestion: z.array(
    z.object({
      id: z.number(),
      itemName: z.string(),
      category: z.string(),
      description: z.string().optional(),
    })
  ).describe('The suggested junk food combo, containing list of item names, categories, and IDs.'),
  reasoning: z.string().describe('The detailed reasoning behind the combo suggestion.'),
});
export type SuggestComboOutput = z.infer<typeof SuggestComboOutputSchema>;

export async function suggestCombo(input: SuggestComboInput): Promise<SuggestComboOutput> {
  return suggestComboFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestComboPrompt',
  input: {
    schema: SuggestComboInputSchema.extend({
      products: z.any(),
      creativitySeed: z.number(),
    }),
  },
  output: { schema: SuggestComboOutputSchema },
  prompt: `You are a personalized junk food combo suggestion expert.

Available Menu Items:
{{#each products}}
- ID: {{this.id}}, Name: {{this.name}} ({{this.category}})
{{/each}}

User Order History:
{{#each userOrderHistory}}
- {{this.itemName}} ({{this.category}})
{{/each}}

User Preferences: {{preferences}}

Suggest a creative junk food combo:
- Use different categories
- Avoid obvious pairings
- Only return items from menu
- Follow JSON schema strictly
- Use creativity seed: {{creativitySeed}}
`,
});



const suggestComboFlow = ai.defineFlow(
  {
    name: 'suggestComboFlow',
    inputSchema: SuggestComboInputSchema,
    outputSchema: SuggestComboOutputSchema,
  },
  async input => {
    const creativitySeed = Math.random();
    const {output} = await prompt({...input, products, creativitySeed});
    return output!;
  }
);
