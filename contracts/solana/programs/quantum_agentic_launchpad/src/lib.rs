use anchor_lang::prelude::*;

declare_id!("QAGNT8Zk1w8s9K1pQomxV3B2LgG7j4N6tUeWqRzYvXp");

#[program]
pub mod quantum_agentic_launchpad {
    use super::*;

    pub fn initialize_agent_launchpad(
        ctx: Context<InitializeLaunchpad>,
        name: String,
        symbol: String,
        ai_model_seed: String,
        initial_supply: u64,
    ) -> Result<()> {
        let launchpad = &mut ctx.accounts.launchpad_state;
        launchpad.authority = ctx.accounts.authority.key();
        launchpad.name = name;
        launchpad.symbol = symbol;
        launchpad.ai_model_seed = ai_model_seed;
        launchpad.total_supply = initial_supply;
        launchpad.total_minted = 0;
        launchpad.total_burned = 0;
        launchpad.graduated = false;

        msg!("Initialized Quantum Agentic Launchpad on Solana Devnet: {}", launchpad.symbol);
        Ok(())
    }

    pub fn strategic_agent_mint(
        ctx: Context<StrategicMint>,
        amount: u64,
        reason: String,
    ) -> Result<()> {
        let launchpad = &mut ctx.accounts.launchpad_state;
        require!(ctx.accounts.authority.key() == launchpad.authority, LaunchpadError::Unauthorized);

        launchpad.total_supply = launchpad.total_supply.checked_add(amount).unwrap();
        launchpad.total_minted = launchpad.total_minted.checked_add(amount).unwrap();

        msg!("Solana Elastic Mint: {} tokens. Reason: {}", amount, reason);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeLaunchpad<'info> {
    #[account(init, payer = authority, space = 8 + 32 + 64 + 16 + 64 + 8 + 8 + 8 + 1)]
    pub launchpad_state: Account<'info, LaunchpadState>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct StrategicMint<'info> {
    #[account(mut)]
    pub launchpad_state: Account<'info, LaunchpadState>,
    pub authority: Signer<'info>,
}

#[account]
pub struct LaunchpadState {
    pub authority: Pubkey,
    pub name: String,
    pub symbol: String,
    pub ai_model_seed: String,
    pub total_supply: u64,
    pub total_minted: u64,
    pub total_burned: u64,
    pub graduated: bool,
}

#[error_code]
pub enum LaunchpadError {
    #[msg("Unauthorized AI Agent or Authority")]
    Unauthorized,
}